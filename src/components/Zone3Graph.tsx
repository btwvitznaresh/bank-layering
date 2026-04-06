import React, { useEffect, useRef, useState, useMemo } from 'react';
import cytoscape, { type Core } from 'cytoscape';
import { useGlobalState } from '../context/GlobalStateContext';
import { accounts, transactions, activeCases, type CaseId } from '../data/mockData';
import Slider from 'rc-slider';
import { twMerge } from 'tailwind-merge';
import { Maximize, ZoomIn, ZoomOut, X, AlertTriangle } from 'lucide-react';


export const Zone3Graph: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlaysRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  
  const { 
    activeCases: globalCases, 
    filters, 
    pathTracer, 
    setPathTracer, 
    setSelectedAccountId,
    searchQuery,
    autoInvestigateState,
    setAutoInvestigateState,
    setToastMessage,
    expandedNodeId,
    setExpandedNodeId
  } = useGlobalState();

  const [contextMenu, setContextMenu] = useState<{x: number, y: number, nodeId: string} | null>(null);
  const [tooltip, setTooltip] = useState<{x: number, y: number, data: any} | null>(null);
  const [timelineVal, setTimelineVal] = useState<number>(new Date('2024-12-31').getTime());
  const [breadcrumbPath, setBreadcrumbPath] = useState<string[]>([]);
  const [viewportRect, setViewportRect] = useState({ top: 10, left: 10, width: 80, height: 80 });
  
  // Custom circular pattern alert
  const [dismissedAlerts, setDismissedAlerts] = useState<boolean>(false);

  // Derived graph elements
  const elements = useMemo(() => {
    // 1. Calculate transaction volume per node for sizing
    const vols: Record<string, number> = {};
    accounts.forEach(a => vols[a.id] = 0);
    transactions.forEach(t => {
      vols[t.source] = (vols[t.source] || 0) + t.amount;
      vols[t.target] = (vols[t.target] || 0) + t.amount;
    });
    
    let maxVol = 0; let minVol = Infinity;
    Object.values(vols).forEach(v => {
      if (v > maxVol) maxVol = v;
      if (v < minVol && v > 0) minVol = v;
    });

    const nodes = accounts.map(a => {
      const vol = vols[a.id] || 0;
      // Size proportional (min 45, max 110)
      const size = maxVol === minVol ? 75 : 45 + ((vol - minVol) / (maxVol - minVol)) * (110 - 45);
      
      const primaryCase = a.cases[0];
      const caseColor = activeCases[primaryCase]?.color || '#00F5FF';
      
      let label = a.name.split(' ')[0];
      
      return {
        data: { 
          id: a.id, 
          label: label, 
          size: a.id === 'ACC012' ? Math.max(130, size) : size,
          color: caseColor,
          isInterCase: a.id === 'ACC007' || a.id === 'ACC012',
          isVpn: a.isVpn,
          raw: a
        },
        classes: [
          (a.id === 'ACC007' || a.id === 'ACC012') ? 'shared-node' : '',
          a.isVpn ? 'vpn-node' : '',
          (a.riskScore || 0) > 60 ? 'high-risk' : ''
        ].filter(Boolean).join(' ')
      };
    });

    const edges = transactions.map(t => {
      return {
        data: { 
          id: t.id, 
          source: t.source, 
          target: t.target, 
          amount: t.amount,
          label: `₹${(t.amount/100000).toFixed(1)}L`,
          date: t.date,
          isSuspicious: t.isSuspicious
        },
        classes: [
          t.isSuspicious ? 'suspicious-edge' : '',
          (() => {
            const src = accounts.find(a => a.id === t.source);
            const tgt = accounts.find(a => a.id === t.target);
            return src && tgt && src.cases[0] !== tgt.cases[0] ? 'inter-case' : '';
          })()
        ].filter(Boolean).join(' ')
      };
    });

    return { nodes, edges };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        {
          selector: 'node',
          style: {
            'shape': 'ellipse',
            'width': 'data(size)',
            'height': 'data(size)',
            'background-color': 'data(color)',
            'background-opacity': 0.3,
            'border-width': 3,
            'border-color': 'data(color)',
            // @ts-ignore
            'shadow-blur': 15,
            'shadow-opacity': 0.8,
            'shadow-color': 'data(color)',
            'label': 'data(label)',
            'color': '#ffffff',
            'font-family': 'Oxanium',
            'font-size': 10,
            'text-valign': 'bottom',
            'text-margin-y': 6,
            'text-background-opacity': 0.8,
            'text-background-color': '#000',
            'text-background-padding': 3,
            'text-background-shape': 'roundrectangle',
            'transition-property': 'opacity, border-color, width, height',
            'transition-duration': 400
          }
        },
        {
          selector: 'node.vpn-node',
          style: {
            'border-color': '#FF3B3B',
            'border-width': 3,
          }
        },
        {
          selector: 'edge',
          style: {
            'width': (ele: any) => Math.max(2, Math.min(6, (ele.data('amount') as number) / 500000)),
            'curve-style': 'bezier',
            'line-color': '#00FF88',
            'target-arrow-color': '#00FF88',
            'target-arrow-shape': 'triangle',
            'opacity': 0.5,
            'label': 'data(label)',
            'font-size': 9,
            'font-family': 'JetBrains Mono, monospace',
            // @ts-ignore
            'font-weight': '500',
            'color': '#00F5FF',
            'text-outline-color': '#050810',
            'text-outline-width': 2,
            'text-rotation': 'autorotate',
            'text-margin-y': -8,
            'transition-property': 'opacity',
            'transition-duration': 400
          }
        },
        {
          selector: 'edge.suspicious-edge',
          style: {
            'line-color': '#FF3B3B',
            'target-arrow-color': '#FF3B3B',
            'line-style': 'dashed',
            // @ts-ignore
            'line-dash-pattern': [6, 3],
            'line-dash-offset': 0,
          }
        },
        {
          selector: 'edge.inter-case',
          style: {
            'line-color': '#FFD700',
            'target-arrow-color': '#FFD700'
          }
        },
        // State classes
        {
          selector: 'node.dimmed',
          style: { 'opacity': 0.08 }
        },
        {
          selector: 'edge.dimmed',
          style: { 'opacity': 0.05 }
        },
        {
          selector: 'node.selected',
          style: {
            'background-color': '#00F5FF',
            'color': '#ffffff',
            'font-weight': 'bold'
          }
        },
        {
          selector: 'edge.path-highlight',
          style: {
            'line-color': '#00F5FF',
            'target-arrow-color': '#00F5FF',
            'opacity': 1,
            'width': 4
          }
        },
        {
          selector: '.search-flash',
          style: {
            // @ts-ignore
            'background-color': '#FFF', 'line-color': '#FFF', 'border-color': '#FFF',
            'target-arrow-color': '#FFF',
            'shadow-color': '#FFF',
            'shadow-blur': 25,
            'shadow-opacity': 1,
            'color': '#FFF',
            'text-outline-color': '#FFF',
          }
        },
        {
          selector: 'node.expanded-focus',
          style: {
            // @ts-ignore
            'background-color': '#FFF', 'border-color': '#FFF', 'color': '#000',
            'shadow-color': '#FFF', 'shadow-blur': 30, 'shadow-opacity': 1,
          }
        },
        {
          selector: 'node.expanded-neighbor',
          style: {
            'border-color': '#00F5FF', 'border-width': 4, 'opacity': 1
          }
        },
        {
          selector: 'edge.expanded-neighbor',
          style: {
            'line-color': '#FFF', 'target-arrow-color': '#FFF', 'opacity': 1, 'width': 4
          }
        }
      ] as any,
    });

    const layout = cy.layout({
      name: 'cose',
      animate: true,
      animationDuration: 1000,
      nodeRepulsion: () => 15000,
      nodeOverlap: 50,
      idealEdgeLength: () => 180,
      edgeElasticity: () => 100,
      nestingFactor: 5,
      gravity: 80,
      numIter: 1000,
      initialTemp: 200,
      coolingFactor: 0.95,
      minTemp: 1.0,
      fit: true,
      padding: 60,
      randomize: true
    } as any);
    layout.run();

    cyRef.current = cy;

    // Interactions
    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      setSelectedAccountId(node.id());
      cy.elements().removeClass('selected');
      node.addClass('selected');
      setContextMenu(null);
      setTooltip(null);
    });

    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        setSelectedAccountId(null);
        cy.elements().removeClass('selected');
      }
      setContextMenu(null);
    });

    // Tooltips
    cy.on('mousemove', 'node', (evt) => {
      const node = evt.target;
      // Get pointer container coordinates
      const cyContainer = cy.container();
      if (!cyContainer) return;
      const rect = cyContainer.getBoundingClientRect();
      setTooltip({
        x: evt.renderedPosition.x + rect.left,
        y: evt.renderedPosition.y + rect.top,
        data: node.data()
      });
    });

    cy.on('mouseout', 'node', () => {
      setTooltip(null);
    });

    // Context menu
    cy.on('cxttap', 'node', (evt) => {
      const node = evt.target;
      setSelectedAccountId(node.id());
      setContextMenu({
        x: evt.originalEvent.clientX,
        y: evt.originalEvent.clientY,
        nodeId: node.id()
      });
    });

    const updateOverlays = () => {
      if (!overlaysRef.current) return;
      const nodes = cy.elements('.shared-node');
      const highRiskNodes = cy.elements('.high-risk');
      const vpnNodes = cy.elements('.vpn-node');
      let html = '';

      // Background Blobs logic
      const casePositions: Record<string, {x: number, y: number, count: number}> = {
        'C1': {x: 0, y: 0, count: 0},
        'C2': {x: 0, y: 0, count: 0},
        'C3': {x: 0, y: 0, count: 0},
        'C4': {x: 0, y: 0, count: 0}
      };
      
      cy.nodes().forEach(n => {
        const p = n.renderedPosition();
        if(!p) return;
        const d = n.data('raw');
        if(d?.cases) {
          d.cases.forEach((c: string) => {
            if(casePositions[c]) {
              casePositions[c].x += p.x;
              casePositions[c].y += p.y;
              casePositions[c].count += 1;
            }
          });
        }
      });

      const caseColors: Record<string, string> = {
        'C1': 'rgba(0, 245, 255, 0.04)',
        'C2': 'rgba(255, 215, 0, 0.04)',
        'C3': 'rgba(155, 93, 229, 0.04)',
        'C4': 'rgba(255, 59, 59, 0.04)'
      };

      Object.keys(casePositions).forEach(k => {
        const cp = casePositions[k];
        if (cp.count > 0) {
          const avgX = cp.x / cp.count;
          const avgY = cp.y / cp.count;
          const size = 600 * cy.zoom(); // Scale with zoom
          html += `<div style="position:absolute; pointer-events:none; left:${avgX}px; top:${avgY}px; width:${size}px; height:${size}px; transform:translate(-50%, -50%); border-radius:50%; background: radial-gradient(circle, ${caseColors[k]} 0%, transparent 70%); z-index: -1;"></div>`;
        }
      });

      nodes.forEach(n => {
        const pos = n.renderedPosition();
        if (!pos) return;
        const size = n.renderedStyle('width') ? parseFloat(n.renderedStyle('width') as string) : 0;
        const pulseAnim = n.id() === 'ACC012' ? 'pulse-gold-double-ring' : 'pulse-gold';
        html += `<div style="position:absolute; pointer-events:none; left:${pos.x}px; top:${pos.y}px; width:${size + 20}px; height:${size + 20}px; transform:translate(-50%, -50%); border-radius:50%; animation: ${pulseAnim} 2s infinite;"></div>`;
        if (n.id() === 'ACC012') {
           html += `<div style="position:absolute; pointer-events:none; left:${pos.x}px; top:${pos.y - size/2 - 15}px; transform:translate(-50%, -50%); font-size:16px;">⭐</div>`;
        }
      });
      highRiskNodes.forEach(n => {
        const pos = n.renderedPosition();
        if (!pos) return;
        const size = n.renderedStyle('width') ? parseFloat(n.renderedStyle('width') as string) : 0;
        html += `<div style="position:absolute; pointer-events:none; left:${pos.x}px; top:${pos.y}px; width:${size + 25}px; height:${size + 25}px; transform:translate(-50%, -50%); border-radius:50%; animation: pulse-red 2s infinite;"></div>`;
      });

      vpnNodes.forEach(n => {
        const pos = n.renderedPosition();
        if (!pos) return;
        const size = n.renderedStyle('width') ? parseFloat(n.renderedStyle('width') as string) : 0;
        html += `<div title="VPN DETECTED — ProtonVPN — 185.220.101.45" style="position:absolute; pointer-events:auto; cursor:help; left:${pos.x}px; top:${pos.y - size/2 - 10}px; transform:translate(-50%, -50%); background:#FF3B3B; color:white; font-size:9px; border-radius:3px; padding:2px 4px; font-family:'DM Sans', sans-serif; font-weight:bold;">⚠ VPN</div>`;
      });
      
      overlaysRef.current.innerHTML = html;

      // Update minimap
      const bb = cy.elements().boundingBox();
      const zoom = cy.zoom();
      const pan = cy.pan();
      if (bb.w > 0 && bb.h > 0) {
         const maxW = bb.w * zoom;
         const maxH = bb.h * zoom;
         const vw = cy.width();
         const vh = cy.height();
         const widthPct = Math.min(100, Math.max(10, (vw / maxW) * 100));
         const heightPct = Math.min(100, Math.max(10, (vh / maxH) * 100));
         const leftPct = Math.max(0, Math.min(100 - widthPct, ((-pan.x + (bb.x1 * zoom)) / maxW) * 100));
         const topPct = Math.max(0, Math.min(100 - heightPct, ((-pan.y + (bb.y1 * zoom)) / maxH) * 100));
         setViewportRect({ top: topPct, left: leftPct, width: widthPct, height: heightPct });
      }
    };

    cy.on('render pan zoom', updateOverlays);

    // Dashboard edge animation
    let offset = 0;
    const edgeInterval = setInterval(() => {
      offset -= 1;
      cy.elements('.suspicious-edge').style('line-dash-offset', offset);
    }, 50);

    // Initial load animation pop
    cy.nodes().forEach((n, i) => {
      setTimeout(() => {
        n.animation({
          style: { 'width': n.data('size') * 1.2, 'height': n.data('size') * 1.2 },
          duration: 300
        } as any).play().promise('complete').then(() => {
          n.animation({ style: { 'width': n.data('size'), 'height': n.data('size') }, duration: 200 } as any).play();
        });
      }, i * 30);
    });

    // Auto-select ACC012 on load
    const selTimeout = setTimeout(() => {
      const node = cy.getElementById('ACC012');
      if (node.length > 0) {
        setSelectedAccountId('ACC012');
        cy.elements().removeClass('selected');
        node.addClass('selected');
      }
    }, 2500);

    const handleAddCase = (e: Event) => {
        const ce = e as CustomEvent;
        const { caseData, accountsList, transactionsList } = ce.detail;
        if (!cyRef.current) return;
        
        const cy = cyRef.current;
        const newNodes = accountsList.map((a: any) => ({
            group: 'nodes',
            data: { 
                id: a.id, 
                label: a.name.split(' ')[0], 
                size: 75,
                color: caseData.color,
                isInterCase: false,
                isVpn: a.isVpn || false,
                raw: a
            },
            classes: a.isVpn ? 'vpn-node' : (a.riskScore > 60 ? 'high-risk' : '')
        }));

        const newEdges = transactionsList.map((t: any) => ({
            group: 'edges',
            data: {
                id: t.id,
                source: t.source,
                target: t.target,
                amount: t.amount,
                label: `₹${(t.amount/100000).toFixed(1)}L`,
                date: t.date,
                isSuspicious: t.isSuspicious
            },
            classes: t.isSuspicious ? 'suspicious-edge' : ''
        }));

        const added = cy.add([...newNodes, ...newEdges]);
        
        // Relayout just the new nodes or the whole graph
        const layout = cy.layout({
            name: 'cose',
            animate: true,
            animationDuration: 1000,
            randomize: true,
            fit: true,
            padding: 60
        } as any);
        layout.run();

        // Pop in animation
        added.nodes().forEach((n: any, i: number) => {
           setTimeout(() => {
               n.animation({ style: { width: 90, height: 90 }, duration: 300 } as any).play();
               setTimeout(() => {
                   n.animation({ style: { width: 75, height: 75 }, duration: 200 } as any).play();
               }, 300);
           }, i * 30);
        });
    };

    const handleDeleteCase = (e: Event) => {
        const ce = e as CustomEvent;
        const caseId = ce.detail;
        if (!cyRef.current) return;
        
        const cy = cyRef.current;
        const nodesToRemove = cy.nodes().filter((n: any) => {
            const cases = n.data('raw').cases;
            return cases.length === 1 && cases[0] === caseId;
        });

        // Update shared nodes
        cy.nodes().forEach((n: any) => {
            const raw = n.data('raw');
            if (raw.cases && raw.cases.includes(caseId)) {
                raw.cases = raw.cases.filter((c: string) => c !== caseId);
                // Also update the color if it was specifically this case's color
                if (raw.cases.length > 0) {
                    const fallbackCase = raw.cases[0];
                    n.data('color', activeCases[fallbackCase]?.color || '#00F5FF');
                }
            }
        });

        if (nodesToRemove.length > 0) {
            nodesToRemove.animate({ style: { opacity: 0 }, duration: 300 } as any);
            setTimeout(() => {
                cy.remove(nodesToRemove);
            }, 300);
        }
    };

    window.addEventListener('banktrace-add-case', handleAddCase);
    window.addEventListener('banktrace-delete-case', handleDeleteCase);

    return () => {
      clearInterval(edgeInterval);
      clearTimeout(selTimeout);
      window.removeEventListener('banktrace-add-case', handleAddCase);
      window.removeEventListener('banktrace-delete-case', handleDeleteCase);
      cy.destroy();
    };
  }, [elements]);

  // Apply visual filtering effect bridging global state to cytoscape API
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    cy.batch(() => {
      // 1. Reset all
      cy.elements().removeClass('dimmed path-highlight expanded-focus expanded-neighbor search-flash');

      // Identify which cases are visible
      const hiddenCases = Object.keys(globalCases).filter(k => !globalCases[k as CaseId]);

      // Expand Network Logic
      if (expandedNodeId) {
         cy.elements().addClass('dimmed');
         const root = cy.getElementById(expandedNodeId);
         if (root.length > 0) {
           root.removeClass('dimmed').addClass('expanded-focus');
           const neighbors = root.neighborhood();
           neighbors.removeClass('dimmed');
           neighbors.nodes().addClass('expanded-neighbor');
           neighbors.edges().addClass('expanded-neighbor');
           // Quick animate
           cy.animate({ center: { eles: root }, zoom: 1.3, duration: 500 });
         }
         setBreadcrumbPath([]);
         return; // Skip normal filters
      }

      // Path Tracer Logic
      if (pathTracer.isActive && pathTracer.source && pathTracer.target) {
        const dijkstra = cy.elements().dijkstra({ root: cy.getElementById(pathTracer.source), directed: true });
        const path = dijkstra.pathTo(cy.getElementById(pathTracer.target));
        
        if (path.length > 0) {
          cy.elements().addClass('dimmed');
          path.removeClass('dimmed');
          path.edges().addClass('path-highlight');
          setBreadcrumbPath(path.nodes().map(n => n.id()));
        } else {
          cy.elements().addClass('dimmed');
          setBreadcrumbPath([]);
        }
        return; // Skip other filters if tracing exact path
      } else {
        setBreadcrumbPath([]);
      }

      // 2. Compute normal filters
      cy.nodes().forEach(node => {
        const d = node.data('raw');
        let shouldDim = false;

        // Hidden Case Toggle
        if (d.cases.every((c: string) => hiddenCases.includes(c))) shouldDim = true;

        // Text Filters
        if (filters.accountHolder && !d.name.toLowerCase().includes(filters.accountHolder.toLowerCase())) shouldDim = true;
        if (filters.phone && !d.phone.includes(filters.phone)) shouldDim = true;
        if (filters.email && !d.email.toLowerCase().includes(filters.email.toLowerCase())) shouldDim = true;
        if (filters.ip && !d.ip.includes(filters.ip)) shouldDim = true;

        if (shouldDim) {
          node.addClass('dimmed');
        }
      });

      // Filter Edges:
      // 1. By timeline scrub
      // 2. By ends (if nodes are dimmed, edge is dimmed)
      // 3. By amount slider
      cy.edges().forEach(edge => {
        const txDate = new Date(edge.data('date')).getTime();
        const amt = edge.data('amount');
        const src = edge.source();
        const tgt = edge.target();

        let shouldDimEdge = false;
        
        if (txDate > timelineVal) shouldDimEdge = true;
        if (amt < filters.amountRange[0] || amt > filters.amountRange[1]) shouldDimEdge = true;
        if (src.hasClass('dimmed') || tgt.hasClass('dimmed')) shouldDimEdge = true;

        // Special Crime Type filtering
        if (filters.crimeType !== 'All') {
          // Dummy logic tying specific links to crime types for the mock
          if (filters.crimeType === 'Hawala' && !globalCases['C1']) shouldDimEdge = true; 
        }

        if (shouldDimEdge) {
          edge.addClass('dimmed');
        }
      });
    });

  }, [globalCases, filters, timelineVal, pathTracer, expandedNodeId]);

  // Global Search
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy || !searchQuery) return;
    
    // Clear previous flash
    cy.elements().removeClass('search-flash');

    const sq = searchQuery.toLowerCase();
    const matchingNodes = cy.nodes().filter(n => {
      const d = n.data('raw');
      return (d.name.toLowerCase().includes(sq) || d.phone.includes(sq) || d.ip.includes(sq) || d.id.toLowerCase() === sq);
    });

    if (matchingNodes.length > 0) {
      if (matchingNodes.length === 1) {
        cy.animate({
          zoom: 1.5,
          center: { eles: matchingNodes[0] },
          duration: 500
        });
      }

      // Flash pulse via class
      let flashes = 0;
      const flashInt = setInterval(() => {
        if (flashes >= 6) {
           clearInterval(flashInt);
           cy.elements().removeClass('search-flash');
           return;
        }
        if (flashes % 2 === 0) matchingNodes.addClass('search-flash');
        else matchingNodes.removeClass('search-flash');
        flashes++;
      }, 300);
    }
  }, [searchQuery]);

  // Auto Investigate Mode
  useEffect(() => {
    if (autoInvestigateState !== 1) return;
    const cy = cyRef.current;
    if (!cy) return;

    let isCancelled = false;
    const runSequence = async () => {
      if (isCancelled) return;
      cy.fit(undefined, 50);
      setToastMessage({ text: "Scanning network...", id: Date.now() });
      await new Promise(r => setTimeout(r, 2000));
      if (isCancelled) return;

      setSelectedAccountId('ACC012');
      cy.elements().removeClass('selected');
      cy.getElementById('ACC012').addClass('selected');
      setToastMessage({ text: "⚠ High-value node detected: ACC012 appears in 4 cases", id: Date.now() });
      await new Promise(r => setTimeout(r, 2000));
      if (isCancelled) return;

      cy.edges('.suspicious-edge').addClass('search-flash');
      setToastMessage({ text: "⚠ Circular transaction loop: ACC003 → ACC008 → ACC015", id: Date.now() });
      await new Promise(r => setTimeout(r, 2000));
      cy.edges().removeClass('search-flash');
      if (isCancelled) return;

      const vpn = cy.getElementById('ACC019');
      if (vpn.length) {
        cy.animate({ zoom: 1.5, center: { eles: vpn }, duration: 800 });
      }
      setToastMessage({ text: "⚠ VPN activity detected: 185.220.101.45", id: Date.now() });
      await new Promise(r => setTimeout(r, 2000));
      if (isCancelled) return;

      cy.edges('.inter-case').addClass('search-flash');
      setToastMessage({ text: "⚠ Inter-case money flow: ₹1.24Cr via ACC007", id: Date.now() });
      await new Promise(r => setTimeout(r, 2000));
      cy.edges().removeClass('search-flash');
      if (isCancelled) return;

      cy.fit(undefined, 50);
      setToastMessage({ text: "Investigation complete — 3 suspicious patterns found", id: Date.now() });
      
      setTimeout(() => setAutoInvestigateState(0), 2000);
    };

    runSequence();
    return () => { isCancelled = true; };
  }, [autoInvestigateState, setSelectedAccountId, setToastMessage, setAutoInvestigateState]);

  // Handle global F G keyboard events
  useEffect(() => {
    const fn = () => cyRef.current?.fit(undefined, 50);
    window.addEventListener('fit-graph', fn);
    return () => window.removeEventListener('fit-graph', fn);
  }, []);

  const fitGraph = () => cyRef.current?.fit(undefined, 50);
  const zoomIn = () => cyRef.current?.zoom(cyRef.current?.zoom() * 1.2);
  const zoomOut = () => cyRef.current?.zoom(cyRef.current?.zoom() * 0.8);

  const formattedDate = new Date(timelineVal).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return (
    <div className="flex-1 h-full relative overflow-hidden bg-transparent z-0" onContextMenu={e => e.preventDefault()}>
      <div className="absolute top-0 left-0 w-full h-full z-0" ref={containerRef} />
      <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none" ref={overlaysRef} />

      {/* Path Breadcrumbs */}
      {expandedNodeId && (
        <div className="absolute top-24 right-6 z-20">
          <button 
            onClick={() => setExpandedNodeId(null)}
            className="glass-panel text-[11px] font-['DM_Sans'] text-white px-4 py-1.5 rounded border border-[var(--accent-red)] hover:bg-[var(--accent-red)] hover:text-black transition-colors"
          >
            ✕ Clear Network View
          </button>
        </div>
      )}

      {breadcrumbPath.length > 0 && !expandedNodeId && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 glass-panel px-6 py-2 rounded-full shadow-[0_0_20px_rgba(0,245,255,0.2)] pointer-events-none border border-[var(--accent-cyan)]">
          {breadcrumbPath.map((id, idx) => (
             <React.Fragment key={id}>
               <span className="text-[13px] font-['JetBrains_Mono'] text-[var(--accent-cyan)] font-bold">{id}</span>
               {idx < breadcrumbPath.length - 1 && <span className="text-[var(--text-muted)] text-[10px] mt-0.5">➔</span>}
             </React.Fragment>
          ))}
        </div>
      )}

      {/* Top Banner Alerts */}
      {!dismissedAlerts && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex flex-col gap-2 w-[480px]">
          <div className="bg-[rgba(255,59,59,0.15)] border border-[var(--accent-red)] rounded px-4 py-2 flex items-center justify-between backdrop-blur shadow-[0_0_20px_rgba(255,59,59,0.2)]">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-[var(--accent-red)]" />
              <span className="text-[11px] font-['DM_Sans'] text-white">
                <strong className="text-[var(--accent-red)] tracking-widest">⚠ CIRCULAR PATTERN DETECTED:</strong><br/>
                ACC003 → ACC008 → ACC015 → ACC003
              </span>
            </div>
            <button onClick={() => setDismissedAlerts(true)} className="text-[var(--text-muted)] hover:text-white"><X className="w-4 h-4"/></button>
          </div>
          <div className="bg-[rgba(255,215,0,0.1)] border border-[var(--accent-gold)] rounded px-4 py-2 flex items-center gap-3 backdrop-blur shadow-[0_0_15px_rgba(255,215,0,0.1)]">
            <span className="text-[10px] font-['DM_Sans'] text-white">
              <strong className="text-[var(--accent-gold)] tracking-widest uppercase">⚠ Inter-case Link:</strong> ACC012 appears in 4 active cases
            </span>
          </div>
        </div>
      )}

      {/* Timeline Slider */}
      <div className="absolute top-4 left-6 right-6 z-10 glass-panel rounded-lg px-6 py-2.5 flex items-center gap-6 max-w-3xl mx-auto border-b-2 border-b-[var(--accent-cyan)] shadow-[0_4px_20px_rgba(0,245,255,0.05)]">
        <span className="text-xs font-['Rajdhani'] font-bold text-[var(--text-muted)] tracking-widest uppercase w-20">Timeline</span>
        <div className="flex-1 px-2">
          <Slider 
            min={new Date('2023-01-01').getTime()} 
            max={new Date('2024-12-31').getTime()} 
            step={86400000} // 1 day
            value={timelineVal}
            onChange={(val) => setTimelineVal(val as number)}
            styles={{
              track: { backgroundColor: 'var(--accent-cyan)' },
              handle: { backgroundColor: '#000', borderColor: 'var(--accent-cyan)', boxShadow: '0 0 10px rgba(0,245,255,0.5)' },
              rail: { backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          />
        </div>
        <span className="text-sm font-['JetBrains_Mono'] text-[var(--accent-cyan)] w-24 text-right">
          {formattedDate}
        </span>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-6 left-6 z-10 flex border-[rgba(255,255,255,0.1)] rounded-md glass-panel overflow-hidden shadow-lg">
        <button onClick={zoomOut} className="p-2 hover:bg-white/10 transition-colors border-r border-[rgba(255,255,255,0.1)] cursor-pointer text-[var(--text-muted)] hover:text-white"><ZoomOut className="w-5 h-5"/></button>
        <button onClick={zoomIn} className="p-2 hover:bg-white/10 transition-colors border-r border-[rgba(255,255,255,0.1)] cursor-pointer text-[var(--text-muted)] hover:text-white"><ZoomIn className="w-5 h-5"/></button>
        <button onClick={fitGraph} className="p-2 hover:bg-white/10 transition-colors cursor-pointer text-[var(--text-muted)] hover:text-white"><Maximize className="w-5 h-5"/></button>
      </div>

      {/* Mini Map (Simulated layout overview) */}
      <div className="absolute bottom-[40px] right-[340px] z-10 w-[160px] h-[100px] glass-panel rounded-md border border-[rgba(0,245,255,0.2)] bg-[#020409] shadow-lg pointer-events-none overflow-hidden">
        {/* Abstract shapes mimicking the graph structural clusters */}
        <div className="w-full h-full relative opacity-100">
          <div className="absolute top-[20%] left-[20%] w-2 h-2 rounded bg-[#00F5FF]"></div>
          <div className="absolute top-[40%] left-[50%] w-2 h-2 rounded bg-[#FFD700]"></div>
          <div className="absolute top-[70%] left-[30%] w-2 h-2 rounded bg-[#9B5DE5]"></div>
          <div className="absolute top-[30%] left-[70%] w-2 h-2 rounded bg-[#FF3B3B]"></div>
          {/* Live Viewport rectangle */}
          <div 
             className="absolute border border-[var(--accent-cyan)] bg-[rgba(0,245,255,0.1)] rounded-sm transition-all duration-75"
             style={{ top: `${viewportRect.top}%`, left: `${viewportRect.left}%`, width: `${viewportRect.width}%`, height: `${viewportRect.height}%` }}
          ></div>
        </div>
      </div>

      {/* Graph Node Hover Tooltip */}
      {tooltip && (
        <div 
          className="fixed z-50 glass-panel rounded-md border border-[var(--border-subtle)] shadow-xl p-3 pointer-events-none min-w-[200px]"
          style={{ 
            top: tooltip.y - 10, 
            left: tooltip.x + 15,
            transform: 'translateY(-50%)'
          }}
        >
          <div className="flex flex-col gap-1.5">
            <h4 className="text-[13px] font-['Oxanium'] font-bold text-white border-b border-[rgba(255,255,255,0.1)] pb-1 mb-1">{tooltip.data.raw?.name}</h4>
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-[var(--text-muted)] font-['Oxanium']">Account ID</span>
              <span className="font-['JetBrains_Mono'] text-[var(--accent-cyan)]">{tooltip.data.id}</span>
            </div>
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-[var(--text-muted)] font-['Oxanium']">Risk Score</span>
              <span className={twMerge("font-['JetBrains_Mono'] px-1 rounded bg-black/40", (tooltip.data.raw?.riskScore || 0) > 60 ? "text-[var(--accent-red)]" : "text-[var(--accent-green)]")}>
                 {tooltip.data.raw?.riskScore || 0}
              </span>
            </div>
            <div className="flex justify-between items-center text-[10px] mt-1 pt-1 border-t border-[rgba(255,255,255,0.05)]">
              <span className="text-[var(--text-muted)] font-['Oxanium']">Balance</span>
              <span className="font-['JetBrains_Mono'] text-[var(--text-primary)] font-bold">
                ₹{((tooltip.data.raw?.balance || 0)/100000).toFixed(1)}L
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Custom Context Menu */}
      {contextMenu && (
        <div 
          className="fixed z-50 glass-panel rounded border border-[var(--accent-cyan)] shadow-[0_5px_20px_rgba(0,245,255,0.2)] py-1 min-w-[180px]"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button 
            className="w-full text-left px-4 py-2 text-xs font-['DM_Sans'] text-white hover:bg-[var(--accent-cyan)] hover:text-black transition-colors cursor-pointer"
            onClick={() => { setSelectedAccountId(contextMenu.nodeId); setContextMenu(null); }}
          >
            🔍 Inspect Account
          </button>
          <button 
            className="w-full text-left px-4 py-2 text-xs font-['DM_Sans'] text-white hover:bg-[var(--accent-cyan)] hover:text-black transition-colors cursor-pointer"
            onClick={() => { setPathTracer({ source: contextMenu.nodeId }); setContextMenu(null); }}
          >
            ↗ Trace From Here
          </button>
          <button 
            className="w-full text-left px-4 py-2 text-xs font-['DM_Sans'] text-[var(--accent-red)] hover:bg-[var(--accent-red)] hover:text-white transition-colors cursor-pointer"
            onClick={() => setContextMenu(null)}
          >
            🚩 Flag as Suspicious
          </button>
          <button 
            className="w-full text-left px-4 py-2 text-xs font-['DM_Sans'] text-white hover:bg-[var(--accent-cyan)] hover:text-black transition-colors cursor-pointer"
            onClick={() => setContextMenu(null)}
          >
            🕸 Expand Network
          </button>
        </div>
      )}
    </div>
  );
};
