// StayListSelect.jsx
import { useEffect, useMemo } from "react";
import React from "react";

export default function StayListSelect() {

  const LABEL_URL = "http://apis.data.go.kr/B551011/KorService2/areaCode2?numOfRows&pageNo&MobileOS=WEB&MobileApp=GT&serviceKey=17597902dc8f58a3494ac35b793fe6990adff432fd1595ecdee96800b0a7eea8&_type=json";


const LIST_URL_BASE = "https://apis.data.go.kr/B551011/KorService2/searchStay2?MobileOS=WEB&MobileApp=GT&serviceKey=17597902dc8f58a3494ac35b793fe6990adff432fd1595ecdee96800b0a7eea8&_type=json&arrange=C&numOfRows&pageNo&sigunguCode";
const AREA_PARAM_KEY = "areacode"; 
const SERVICE_KEY_RAW = "17597902dc8f58a3494ac35b793fe6990adff432fd1595ecdee96800b0a7eea8";
const SERVICE_KEY =
  SERVICE_KEY_RAW.includes("%") ? decodeURIComponent(SERVICE_KEY_RAW) : SERVICE_KEY_RAW;
  
  const [selectedId, setSelectedId]   = React.useState("");
  const [labelRows, setLabelRows]     = React.useState([]);
  const [items, setItems]             = React.useState([]);
  const [loading, setLoading]         = React.useState(false);
  const [error, setError]             = React.useState("");
  const [pageNo, setPageNo]           = React.useState(1);
  const [hasMore, setHasMore]         = React.useState(true);
  const [cooldownUntil, setCooldownUntil]  = React.useState(0);
  const inFlightRef                   = React.useRef(false);
  const PAGE_SIZE = 6;


  /* ───────── 유틸 (컴포넌트 내부에 정의) ───────── */
  const normalize = (data) => {
    const src =
      data?.response?.body?.items?.item ??
      data?.items ?? data?.data ?? data;
    return Array.isArray(src) ? src : Object.values(src ?? {});
  };

  const areaIdOf = (it) =>
    String(it.areacode ?? it.areaCode ?? it.code ?? it.id ?? "");

  const labelOfArea = (it) =>
    String(
      it.name ?? it.areaname ?? it.areaName ?? ""
    ).trim();

  const idOf = (it, idx) =>
    String(it.contentid ?? it.id ?? it.code ?? `${idx}`);

  const imgOf = (it) =>
    it.firstimage ?? it.firstimage2 ?? "";


  const formatDate = (v) => {
    if (!v) return "";
    const s = String(v);
    if (/^\d{8}$/.test(s))   return `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}`;
    if (/^\d{14}$/.test(s))  return `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)} ${s.slice(8,10)}:${s.slice(10,12)}`;
    const d = new Date(s);
    return isNaN(d.getTime()) ? s : d.toLocaleString("ko-KR");
  };

const buildLabelUrl = () => {
    const u = new URL(LABEL_URL);
    const sp = u.searchParams;
    sp.set("_type", "json");
    sp.set("MobileOS", "WEB");
    sp.set("MobileApp", "GT");
    sp.set("numOfRows", "17");
    sp.set("serviceKey", SERVICE_KEY);
    return u.toString();
  };

// async function fetchJson(url, signal) {
//     const res = await fetch(url, { signal });
//     const ct  = res.headers.get("content-type") || "";
//     const raw = await res.text();
//     console.log("[FETCH]", res.status, ct, url, raw.slice(0, 200));
//     if (!ct.includes("application/json")) {
//       // 한도 초과(22) 감지
//       if (raw.includes("LIMITED_NUMBER_OF_SERVICE_REQUESTS_EXCEEDS_ERROR") ||
//           raw.includes("<returnReasonCode>22</returnReasonCode>")) {
//         setError("API 호출 한도 초과(code 22). 잠시 후 다시 시도하세요.");
//         setCooldownUntil(Date.now() + 60 * 1000); // 60초 쿨다운
//         return null;
//       }
//       throw new Error("JSON이 아닌 응답(키/파라미터/경로 확인)");
//     }
//     return JSON.parse(raw);
//   }

  const buildListUrl = (areaId, extra = {}) => {
    const u = new URL(LIST_URL_BASE);
    const sp = u.searchParams;
    sp.set(AREA_PARAM_KEY, String(areaId)); //
    sp.set("_type", "json");
    sp.set("MobileOS", "WEB");
    sp.set("MobileApp", "GT");
    sp.set("numOfRows", "12");
    if (SERVICE_KEY) sp.set("serviceKey", SERVICE_KEY);
    Object.entries(extra).forEach(([k, v]) => {
      if (v != null && v !== "") sp.set(k, String(v));
    });
    return u.toString();
  };
  /* ───────────────────────────────────────── */

  /* ───────── 라벨 로드(한 번) ───────── */
  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        const url = buildLabelUrl();
        const res = await fetch(url, { signal: ctrl.signal });
        const ct  = res.headers.get("content-type") || "";
        const raw = await res.text();
        // 디버그
        // console.log("[LABEL]", res.status, ct, url, raw.slice(0, 200));
        if (!ct.includes("application/json")) {
          throw new Error("라벨 API가 JSON이 아닙니다(키/필수 파라미터/경로/CORS 확인).");
        }
        const json = JSON.parse(raw);
        setLabelRows(normalize(json));
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message || String(e));
      }
    })();
    return () => ctrl.abort();
  }, [SERVICE_KEY]);

  const options = useMemo(() => {
    const seen = new Set();
    const out = [];
    labelRows.forEach((it) => {
      const id = areaIdOf(it);
      if (!id || seen.has(id)) return;
      seen.add(id);
      const label = labelOfArea(it) || id;
      out.push({ id, label });
    });
    return out;
  }, [labelRows]);

  // ===== 더 보기(다음 6개) =====
  async function loadMore() {
    if (!selectedId || !hasMore) return;

    if (Date.now() < cooldownUntil) {
      setError(`쿨다운: ${Math.ceil((cooldownUntil - Date.now())/1000)}초 후 재시도`);
      return;
    }
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    try {
      setLoading(true);
      setError("");
      const next = pageNo + 1;
      const url = buildStayUrl({ areaCode: selectedId, pageNo: next });
      const res = await fetch(url);
      const ct  = res.headers.get("content-type") || "";
      const raw = await res.text();
      // console.log("[LIST-N]", res.status, ct, url, raw.slice(0, 200));

function buildStayUrl({ areaCode, pageNo = 1, numOfRows = (typeof PAGE_SIZE !== "undefined" ? PAGE_SIZE : 6) }) {
  if (!areaCode) throw new Error("areaCode가 비어 있습니다.");
  const u = new URL(LIST_URL_BASE);        // ← 이미 위에서 선언한 상수 사용
  const sp = u.searchParams;
  sp.set("areaCode", String(areaCode));    // 필요하면 AREA_PARAM_KEY로 교체
  sp.set("pageNo", String(pageNo));
  sp.set("numOfRows", String(numOfRows));
  sp.set("arrange", "C");
  sp.set("_type", "json");
  sp.set("MobileOS", "WEB");
  sp.set("MobileApp", "GT");
  sp.set("serviceKey", SERVICE_KEY);       // Encoded면 1회 decode된 값이어야 함
  return u.toString();
}

      if (!ct.includes("application/json")) {
        if (raw.includes("LIMITED_NUMBER_OF_SERVICE_REQUESTS_EXCEEDS_ERROR") ||
            raw.includes("<returnReasonCode>22</returnReasonCode>")) {
          setError("API 한도 초과(code 22). 잠시 후 다시 시도하세요.");
          setCooldownUntil(Date.now() + 60 * 1000);
          return;
        }
        throw new Error("JSON이 아닌 응답(키/필수 파라미터/경로 확인)");
      }

      const data = JSON.parse(raw);
      const rows = normalize(data);
      setItems((prev) => dedupeById([...prev, ...rows]));
      setPageNo(next);
      setHasMore(Array.isArray(rows) && rows.length === PAGE_SIZE);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  }
  
function dedupeById(rows = []) {
  const seen = new Set();
  return rows.filter((it, idx) => {
    const key = String(it.contentid ?? it.id ?? it.code ?? `row_${idx}`);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
} 

  /* ───────── 선택 바뀌면 리스트 로드(1페이지만) ───────── */
  useEffect(() => {
    if (!selectedId) { setItems([]); setError(""); return; }
    const ctrl = new AbortController();
    (async () => {
      setLoading(true); setError("");
      try {
        const url = buildListUrl(selectedId, { pageNo: 1, numOfRows: 6 });
        const res = await fetch(url, { signal: ctrl.signal });
        const ct  = res.headers.get("content-type") || "";
        const raw = await res.text();
        // 디버그
        console.log("[LIST]", res.status, ct, url, raw.slice(0, 200));
        if (!ct.includes("application/json")) {
          throw new Error("JSON이 아닌 응답(키/필수 파라미터/경로 확인)");
        }
        const data = JSON.parse(raw);
        setItems(normalize(data));
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message || String(e));
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [selectedId, SERVICE_KEY]);

  /* ───────── 렌더 ───────── */
  return (
    <div style={{ padding: 16 }}>
      {/* 셀렉트(항상 표시). id/name 달아서 경고 제거 */}
      <label htmlFor="area">지역:&nbsp;</label>
      <select
        id="area"
        name="area"
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        disabled={options.length === 0 && !error}
      >
        <option value="">-- 지역 선택 --</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>{o.label}</option>
        ))}
      </select>

      <div style={{ marginTop: 8, fontSize: 13 }}>
        {loading && "불러오는 중…"}
        {error   && <span style={{ color: "crimson" }}>에러: {error}</span>}
      </div>

      {/* 초기엔 카드 없음, 선택하면 출력 */}
      {selectedId && <CardsGrid items={items} />}
      {!loading && !error && selectedId && items.length === 0 && (
        <p style={{ marginTop: 12 }}>표시할 항목이 없습니다.</p>
      )}
    </div>
  );

  /* ───────── 내부 카드 컴포넌트 ───────── */
  function CardsGrid({ items = [] }) {
    return (
      <div
        style={{
          marginTop: 8,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))",
          gap: 12,
        }}
      >
        {items.map((it, idx) => {
          const key = idOf(it, idx);
          const title = (it.title ?? it.name ?? "").trim() || "(제목 없음)";
          const src = safeImageUrl(imgOf(it));
          const updated = formatDate(
            it.modifiedtime ??  ""
          );

          function safeImageUrl(raw) {
          if (!raw) return "";
          let url = String(raw).trim();

          // 공백/한글 경로 보정
          url = url.replace(/\s/g, "%20");

          // http → https 업그레이드, 스킴 보정
          if (url.startsWith("//")) url = "https:" + url;
          if (url.startsWith("http://")) url = url.replace(/^http:\/\//, "https://");

          try {
            // 유효한 URL이면 그대로 반환
            return new URL(url).toString();
          } catch {
            // 상대/이상 문자열이면 일단 인코딩해서 반환
            return encodeURI(url);
          }
        }

          return (
            <article
              key={key}
              style={{
                border: "1px solid rgb(53, 36, 11)",
                borderRadius: 12,
                overflow: "hidden",
                background: "#a79e84",
              }}
            >
              <div
                style={{
                  height: 140,
                  background: "#a79e84",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {src ? (
                <img
                  src={src}
                  alt={title}
                  referrerPolicy="no-referrer"         // 🔒 핫링크(Referer) 차단 회피
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ color: "rgb(53, 36, 11)", fontSize: 12 }}>이미지 없음</span>
              )}
              </div>
              <div style={{ padding: 12 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }} title={title}>
                  {title}
                </div>
                {updated && (
                  <div style={{ fontSize: 12, color: "rgb(53, 36, 11)", marginTop: 4 }}>
                    업데이트: {updated.slice(-14).slice(0,8)}
                  </div>
                )}
              </div>
            </article>
          );
        })}
        
      <div style={{ marginTop: 12 }}>
        {hasMore && !loading && !error && (
          <button type="button" onClick={loadMore}>
            더 보기 (다음 {PAGE_SIZE}개)
          </button>
        )}
      </div>
    </div>
  );
  }
  }
