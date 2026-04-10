// import { useCallback, useEffect, useMemo, useState } from "react";
// import FiltersBar, { type EventFilterType } from "@/components/FiltersBar";
// import MapView from "@/components/MapView";
// import Timeline from "@/components/Timeline";
// import Legend from "@/components/Legend";
// import SidePanel from "@/components/SidePanel";
// import {
//   getEvents,
//   getHeatmap,
//   getMaps,
//   getMatches,
//   getSummary,
//   type BackendEvent,
//   type MapApiItem,
//   type MatchApiItem,
//   type SummaryResponse,
// } from "@/services/api";

// const Index = () => {
//   const [maps, setMaps] = useState<MapApiItem[]>([]);
//   const [matches, setMatches] = useState<MatchApiItem[]>([]);

//   const [selectedMap, setSelectedMap] = useState("");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [selectedMatch, setSelectedMatch] = useState("");
//   const [selectedEventType, setSelectedEventType] = useState<EventFilterType>("all");

//   const [events, setEvents] = useState<BackendEvent[]>([]);
//   const [heatmap, setHeatmap] = useState<BackendEvent[]>([]);
//   const [summary, setSummary] = useState<SummaryResponse>({});

//   const [currentTime, setCurrentTime] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);

//   const [sidePanelOpen, setSidePanelOpen] = useState(true);
//   const [showPaths, setShowPaths] = useState(true);
//   const [showEvents, setShowEvents] = useState(true);
//   const [showHeatmap, setShowHeatmap] = useState(false);

//   const [loadingCount, setLoadingCount] = useState(0);

//   const withLoading = useCallback(
//     async function <T>(task: () => Promise<T>): Promise<T> {
//       setLoadingCount((v) => v + 1);
//       try {
//         return await task();
//       } finally {
//         setLoadingCount((v) => Math.max(0, v - 1));
//       }
//     },
//     [],
//   );

//   useEffect(() => {
//     let mounted = true;

//     withLoading(async () => {
//       const [mapsResponse, summaryResponse] = await Promise.all([
//         getMaps(),
//         getSummary().catch(() => ({} as SummaryResponse)),
//       ]);

//       if (!mounted) return;

//       setMaps(mapsResponse);
//       setSummary(summaryResponse);

//       const firstMap = mapsResponse[0];
//       setSelectedMap(firstMap?.map_id ?? "");
//       setSelectedDate(firstMap?.dates?.[0] ?? "");
//     }).catch((error) => {
//       console.error("Failed to load maps:", error);
//       if (mounted) {
//         setMaps([]);
//         setSelectedMap("");
//         setSelectedDate("");
//       }
//     });

//     return () => {
//       mounted = false;
//     };
//   }, [withLoading]);

//   useEffect(() => {
//     const selectedMapItem = maps.find((m) => m.map_id === selectedMap);
//     if (!selectedMapItem) return;

//     if (!selectedMapItem.dates.includes(selectedDate)) {
//       setSelectedDate(selectedMapItem.dates[0] ?? "");
//     }
//   }, [maps, selectedMap, selectedDate]);

//   useEffect(() => {
//     if (!selectedMap || !selectedDate) {
//       setMatches([]);
//       setSelectedMatch("");
//       return;
//     }

//     let mounted = true;

//     withLoading(async () => {
//       const response = await getMatches({ map_id: selectedMap, date: selectedDate });
//       if (!mounted) return;

//       setMatches(response);
//       setSelectedMatch((previous) => {
//         if (response.some((match) => match.match_id === previous)) return previous;
//         return response[0]?.match_id ?? "";
//       });

//       if (response.length === 0) {
//         setEvents([]);
//         setCurrentTime(0);
//       }
//     }).catch((error) => {
//       console.error("Failed to load matches:", error);
//       if (mounted) {
//         setMatches([]);
//         setSelectedMatch("");
//       }
//     });

//     return () => {
//       mounted = false;
//     };
//   }, [selectedMap, selectedDate, withLoading]);

//   useEffect(() => {
//     if (!selectedMap || !selectedDate || !selectedMatch) {
//       setEvents([]);
//       setCurrentTime(0);
//       return;
//     }

//     let mounted = true;

//     withLoading(async () => {
//       const response = await getEvents({
//         map_id: selectedMap,
//         date: selectedDate,
//         match_id: selectedMatch,
//         event_type: selectedEventType === "all" ? undefined : selectedEventType,
//         limit: 10000,
//       });

//       if (!mounted) return;

//       setEvents(response ?? []);
//       setCurrentTime((previous) => {
//         const nextMaxTime = (response ?? []).reduce((max, event) => Math.max(max, Number(event.ts_ms) || 0), 0);
//         return Math.min(previous, nextMaxTime || 0);
//       });
//     }).catch((error) => {
//       console.error("Failed to load events:", error);
//       if (mounted) setEvents([]);
//     });

//     return () => {
//       mounted = false;
//     };
//   }, [selectedMap, selectedDate, selectedMatch, selectedEventType, withLoading]);

//   useEffect(() => {
//     if (!showHeatmap || !selectedMap) {
//       setHeatmap([]);
//       return;
//     }

//     let mounted = true;

//     withLoading(async () => {
//       const heatmapEventType = selectedEventType === "all" ? "Kill" : selectedEventType;
//       const response = await getHeatmap({
//         map_id: selectedMap,
//         event_type: heatmapEventType,
//       });

//       if (!mounted) return;
//       setHeatmap(response ?? []);
//     }).catch((error) => {
//       console.error("Failed to load heatmap:", error);
//       if (mounted) setHeatmap([]);
//     });

//     return () => {
//       mounted = false;
//     };
//   }, [showHeatmap, selectedMap, selectedEventType, withLoading]);

//   const maxTime = useMemo(
//     () => events.reduce((max, event) => Math.max(max, Number(event.ts_ms) || 0), 0),
//     [events],
//   );

//   useEffect(() => {
//     if (!isPlaying || maxTime <= 0) return;

//     const intervalId = setInterval(() => {
//       setCurrentTime((previous) => {
//         const next = previous + 100;
//         if (next >= maxTime) {
//           setIsPlaying(false);
//           return maxTime;
//         }
//         return next;
//       });
//     }, 100);

//     return () => clearInterval(intervalId);
//   }, [isPlaying, maxTime]);

//   useEffect(() => {
//     console.log("maps:", maps);
//   }, [maps]);

//   useEffect(() => {
//     console.log("selectedMap:", selectedMap);
//   }, [selectedMap]);

//   useEffect(() => {
//     console.log("events sample:", (events ?? []).slice(0, 5));
//   }, [events]);

//   const selectedMapObject = maps.find((map) => map.map_id === selectedMap);
//   const visibleEvents = useMemo(() => {
//     const source = events ?? [];
//     return source.filter((event) => Number(event.ts_ms) <= currentTime);
//   }, [events, currentTime]);

//   const resetFilters = useCallback(() => {
//     const firstMap = maps[0];
//     setSelectedMap(firstMap?.map_id ?? "");
//     setSelectedDate(firstMap?.dates?.[0] ?? "");
//     setSelectedMatch("");
//     setSelectedEventType("all");
//     setCurrentTime(0);
//     setIsPlaying(false);
//     setShowPaths(true);
//     setShowEvents(true);
//     setShowHeatmap(false);
//   }, [maps]);

//   const loading = loadingCount > 0;

//   if (!maps.length) {
//     return <div className="p-6 text-sm text-muted-foreground">Loading maps...</div>;
//   }

//   if (!selectedMap) {
//     return <div className="p-6 text-sm text-muted-foreground">No maps available.</div>;
//   }

//   return (
//     <div className="relative flex min-h-screen flex-col gap-3 bg-background p-4">
//       {loading && (
//         <div className="absolute inset-0 z-40 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
//           <div className="rounded border border-border bg-card px-3 py-2 text-sm text-muted-foreground">Loading...</div>
//         </div>
//       )}

//       <FiltersBar
//         maps={maps}
//         matches={matches}
//         selectedMap={selectedMap}
//         selectedDate={selectedDate}
//         selectedMatch={selectedMatch}
//         selectedEventType={selectedEventType}
//         onMapChange={(nextMap) => {
//           setSelectedMap(nextMap);
//           setCurrentTime(0);
//           setIsPlaying(false);
//         }}
//         onDateChange={(nextDate) => {
//           setSelectedDate(nextDate);
//           setCurrentTime(0);
//           setIsPlaying(false);
//         }}
//         onMatchChange={(nextMatch) => {
//           setSelectedMatch(nextMatch);
//           setCurrentTime(0);
//           setIsPlaying(false);
//         }}
//         onEventTypeChange={(nextEventType) => {
//           setSelectedEventType(nextEventType);
//           setCurrentTime(0);
//           setIsPlaying(false);
//         }}
//         onReset={resetFilters}
//       />

//       <div className="flex min-h-0 flex-1 gap-3">
//         <div className="flex min-w-0 flex-1 flex-col gap-3">
//           <div className="flex flex-1 items-center justify-center">
//             <MapView
//               minimapUrl={selectedMapObject?.minimap_url}
//               events={visibleEvents}
//               heatmap={heatmap}
//               showPaths={showPaths}
//               showEvents={showEvents}
//               showHeatmap={showHeatmap}
//             />
//           </div>

//           <Timeline
//             currentTime={currentTime}
//             maxTime={Math.max(maxTime, 1)}
//             isPlaying={isPlaying}
//             onTimeChange={setCurrentTime}
//             onTogglePlay={() => setIsPlaying((previous) => !previous)}
//           />

//           <Legend />
//         </div>

//         <div className="relative">
//           <SidePanel
//             isOpen={sidePanelOpen}
//             onToggle={() => setSidePanelOpen((previous) => !previous)}
//             showPaths={showPaths}
//             showEvents={showEvents}
//             showHeatmap={showHeatmap}
//             onTogglePaths={setShowPaths}
//             onToggleEvents={setShowEvents}
//             onToggleHeatmap={setShowHeatmap}
//             summary={summary}
//             events={events}
//             maxTime={maxTime}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Index;

import { useCallback, useEffect, useMemo, useState } from "react";
import FiltersBar, { type EventFilterType } from "@/components/FiltersBar";
import MapView from "@/components/MapView";
import Timeline from "@/components/Timeline";
import Legend from "@/components/Legend";
import SidePanel from "@/components/SidePanel";
import {
  getEvents, getHeatmap, getMaps, getMatches, getSummary,
  type BackendEvent, type MapApiItem, type MatchApiItem, type SummaryResponse,
} from "@/services/api";

const Index = () => {
  const [maps,    setMaps]    = useState<MapApiItem[]>([]);
  const [matches, setMatches] = useState<MatchApiItem[]>([]);
  const [events,  setEvents]  = useState<BackendEvent[]>([]);
  const [heatmap, setHeatmap] = useState<BackendEvent[]>([]);
  const [summary, setSummary] = useState<SummaryResponse>({});

  const [selectedMap,       setSelectedMap]       = useState("");
  const [selectedDate,      setSelectedDate]      = useState("");
  const [selectedMatch,     setSelectedMatch]     = useState("");
  const [selectedEventType, setSelectedEventType] = useState<EventFilterType>("all");

  const [showPaths,     setShowPaths]     = useState(true);
  const [showEvents,    setShowEvents]    = useState(true);
  const [showHeatmap,   setShowHeatmap]   = useState(false);
  const [sidePanelOpen, setSidePanelOpen] = useState(true);

  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying,   setIsPlaying]   = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [loadingCount, setLoadingCount] = useState(0);

  const isLoading = loadingCount > 0;

  const withLoading = useCallback(async <T,>(task: () => Promise<T>): Promise<T> => {
    setLoadingCount((v) => v + 1);
    try { return await task(); }
    finally { setLoadingCount((v) => Math.max(0, v - 1)); }
  }, []);

  // ── LOAD 1: Maps + Summary ─────────────────────────────────
  useEffect(() => {
    let mounted = true;
    withLoading(async () => {
      const [mapsRes, summaryRes] = await Promise.all([
        getMaps(),
        getSummary().catch(() => ({} as SummaryResponse)),
      ]);
      if (!mounted) return;
      setMaps(mapsRes);
      setSummary(summaryRes);
      const first = mapsRes[0];
      setSelectedMap(first?.map_id ?? "");
      setSelectedDate(first?.dates?.[0] ?? "");
    }).catch(console.error);
    return () => { mounted = false; };
  }, [withLoading]);

  // ── LOAD 2: Matches ────────────────────────────────────────
  useEffect(() => {
    if (!selectedMap || !selectedDate) {
      setMatches([]);
      setSelectedMatch("");
      return;
    }
    let mounted = true;
    withLoading(async () => {
      const res = await getMatches({ map_id: selectedMap, date: selectedDate });
      if (!mounted) return;
      setMatches(res);
      setSelectedMatch(res[0]?.match_id ?? "");
      if (res.length === 0) {
        setEvents([]);
        setCurrentTime(0);
      }
    }).catch(console.error);
    return () => { mounted = false; };
  }, [selectedMap, selectedDate, withLoading]);

  // ── LOAD 3: Events ─────────────────────────────────────────
  useEffect(() => {
    if (!selectedMap || !selectedDate || !selectedMatch) {
      setEvents([]);
      setCurrentTime(0);
      return;
    }
    let mounted = true;
    withLoading(async () => {
      const res = await getEvents({
        map_id:     selectedMap,
        date:       selectedDate,
        match_id:   selectedMatch,
        event_type: selectedEventType === "all" ? undefined : selectedEventType,
        limit:      10000,
      });
      if (!mounted) return;
      const data = res ?? [];
      setEvents(data);
      setIsPlaying(false);
      console.log("Events loaded:", data.length, "first ts_ms:", data[0]?.ts_ms);
    }).catch(console.error);
    return () => { mounted = false; };
  }, [selectedMap, selectedDate, selectedMatch, selectedEventType, withLoading]);

  // ── LOAD 4: Heatmap ────────────────────────────────────────
  useEffect(() => {
    if (!showHeatmap || !selectedMap) {
      setHeatmap([]);
      return;
    }
    let mounted = true;
    withLoading(async () => {
      const res = await getHeatmap({ map_id: selectedMap, event_type: "Kill" });
      if (!mounted) return;
      setHeatmap(res ?? []);
    }).catch(console.error);
    return () => { mounted = false; };
  }, [showHeatmap, selectedMap, withLoading]);

  // ── Relative timestamps ────────────────────────────────────
  // minTs = earliest event in this match
  // maxTime = match duration in ms (max - min)
  const minTs = useMemo(() => {
    if (!events.length) return 0;
    return events.reduce((min, e) => Math.min(min, Number(e.ts_ms) || 0), Infinity);
  }, [events]);

  const maxTime = useMemo(() => {
    if (!events.length) return 1;
    const max = events.reduce((m, e) => Math.max(m, Number(e.ts_ms) || 0), 0);
    const duration = max - minTs;
    console.log("maxTime calculated:", duration, "ms =", Math.floor(duration/60000), "min");
    return duration > 0 ? duration : 1;
  }, [events, minTs]);

  // ── Auto-show all events when match loads ──────────────────
  // Sets currentTime = maxTime so all events are visible by default
  useEffect(() => {
    if (maxTime > 1) {
      setCurrentTime(maxTime);
    }
  }, [maxTime]);

  // ── Playback ───────────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying || maxTime <= 0) return;
    const id = setInterval(() => {
      setCurrentTime((prev) => {
      const baseStep = maxTime < 1000 ? 10 : 100;
      const step = Math.max(1, Math.round(baseStep * playbackSpeed));
      const next = prev + step;
        if (next >= maxTime) { setIsPlaying(false); return maxTime; }
        return next;
      });
    }, 100);
    return () => clearInterval(id);
  }, [isPlaying, maxTime, playbackSpeed]);

  // ── Filter events by relative timeline position ────────────
  const visibleEvents = useMemo(() => {
    if (!events.length) return [];
    return events.filter((e) => (Number(e.ts_ms) - minTs) <= currentTime);
  }, [events, currentTime, minTs]);

  const selectedMapObject = maps.find((m) => m.map_id === selectedMap);

  const resetFilters = useCallback(() => {
    const first = maps[0];
    setSelectedMap(first?.map_id ?? "");
    setSelectedDate(first?.dates?.[0] ?? "");
    setSelectedMatch("");
    setSelectedEventType("all");
    setCurrentTime(0);
    setIsPlaying(false);
    setPlaybackSpeed(1);
    setShowPaths(true);
    setShowEvents(true);
    setShowHeatmap(false);
  }, [maps]);

  // ── Full-page loader ───────────────────────────────────────
  if (!maps.length && isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground font-mono text-sm">
          Connecting to LILA BLACK servers...
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen overflow-hidden flex-col gap-3 bg-background p-4">

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-background/60 backdrop-blur-[1px] pointer-events-none">
          <div className="flex items-center gap-2 rounded border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Hold on LILA Game Analysis Is Loading...
          </div>
        </div>
      )}

      <FiltersBar
        maps={maps}
        matches={matches}
        selectedMap={selectedMap}
        selectedDate={selectedDate}
        selectedMatch={selectedMatch}
        selectedEventType={selectedEventType}
        onMapChange={(v) => { setSelectedMap(v); setCurrentTime(0); setIsPlaying(false); }}
        onDateChange={(v) => { setSelectedDate(v); setCurrentTime(0); setIsPlaying(false); }}
        onMatchChange={(v) => { setSelectedMatch(v); setCurrentTime(0); setIsPlaying(false); }}
        onEventTypeChange={(v) => { setSelectedEventType(v); setCurrentTime(0); setIsPlaying(false); }}
        onReset={resetFilters}
      />

      <div className="flex min-h-0 flex-1 gap-3 overflow-hidden">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-hidden">

          <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden">
            <MapView
              minimapUrl={selectedMapObject?.minimap_url}
              events={visibleEvents}
              mapId={selectedMap}
              heatmap={heatmap}
              showPaths={showPaths}
              showEvents={showEvents}
              showHeatmap={showHeatmap}
            />
          </div>

          <Timeline
            currentTime={currentTime}
            maxTime={Math.max(maxTime, 1)}
            isPlaying={isPlaying}
            playbackSpeed={playbackSpeed}
            onTimeChange={setCurrentTime}
            visibleCount={visibleEvents.length}
            totalCount={events.length}
            onTogglePlay={() => setIsPlaying((p) => !p)}
            onPlaybackSpeedChange={setPlaybackSpeed}
          />

          <Legend />
        </div>

        <div className="relative min-h-0 self-stretch">
          <SidePanel
            isOpen={sidePanelOpen}
            onToggle={() => setSidePanelOpen((p) => !p)}
            showPaths={showPaths}
            showEvents={showEvents}
            showHeatmap={showHeatmap}
            onTogglePaths={setShowPaths}
            onToggleEvents={setShowEvents}
            onToggleHeatmap={setShowHeatmap}
            summary={summary}
            events={visibleEvents}
            maxTime={maxTime}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
