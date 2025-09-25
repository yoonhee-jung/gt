// AreaSelectAndList.jsx
import { useEffect, useMemo, useState } from "react";
import { setStayInfo } from "../../store/slices/stayShowSlice";
import './StayListSelect.css'
import { useDispatch } from "react-redux";
import StayShow from ".//StayShow.jsx";
/** 1) 여기에 최종 API URL 그대로 넣어 */
const AREAS_URL =
  "https://apis.data.go.kr/B551011/KorService2/searchStay2?MobileOS=WEB&MobileApp=GT&serviceKey=17597902dc8f58a3494ac35b793fe6990adff432fd1595ecdee96800b0a7eea8&_type=json&lDongRegnCd=&arrange=C&areaCode=&sigunguCode=&numOfRows&pageNo";

/** 2) 선택 후 리스트를 “다른 엔드포인트로” 다시 불러오고 싶다면 설정 (없으면 빈 문자열) */
const CHILD_URL_BASE = ""; // 예: "https://apis.data.go.kr/B551011/KorService1/areaBasedList1"
const CHILD_PARAM_KEY = "areaCode"; // 네 API가 요구하는 파라미터 키(예: areacode, areaCode 등)

export default function AreaSelectAndList() {
  const [areas, setAreas] = useState([]);          // 옵션 원본 데이터
  const [selectedId, setSelectedId] = useState(""); // 선택된 area id
  const [list, setList] = useState([]);            // 선택에 따라 바뀌는 리스트
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  // ---------- 공통 유틸 ----------
  const normalize = (data) => {

    const src =
      data?.response?.body?.items?.item ??
      data?.response?.body?.items?.item.rnum ??
      data?.response?.body?.items?.item.name  ??
      data?.response?.body?.items?.item.code  ??
      data;
    const arr = Array.isArray(src) ? src : Object.values(src ?? {});
    return arr;
  };

  const makeId = (it) =>
    String(
      it.response?.body?.items?.item.name ??
        it.sigungucode ??
        ""
    );

  const makeLabel = (it) =>
    String(
      (it.response?.body?.items?.item.name ?? it.sigungucode ?? "")
        .toString()
        .trim() || makeId(it)
    );

  const dedupeById = (arr) => {
    const seen = new Set();
    const out = [];
    for (const it of arr) {
      const id = makeId(it);
      if (!id || seen.has(id)) continue;
      seen.add(id);
      out.push(it);
    }
    return out;
  };

  // ---------- 최초: 지역 옵션 불러오기 ----------
  useEffect(() => {
    let abort = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const r = await fetch(AREAS_URL);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const ct = r.headers.get("content-type") || "";
        if (!ct.includes("application/json")) {
          throw new Error(
            "에러"
          );
        }
        const data = await r.json();
        const arr = dedupeById(normalize(data));
        if (!abort) setAreas(arr);
      } catch (e) {
        if (!abort) setError(e.message || String(e));
      } finally {
        if (!abort) setLoading(false);
      }
    })();
    return () => {
      abort = true;
    };
  }, []);

  // 옵션 객체(키/라벨)로 변환 + 중복 key 방어
  const options = useMemo(() => {
    const out = [];
    const used = new Set();
    areas.forEach((it, idx) => {
      const id = makeId(it) || `idx${idx}`;
      let key = id;
      // 혹시라도 같은 id가 또 오면 접미사로 중복 방지
      let n = 1;
      while (used.has(key)) key = `${id}__${n++}`;
      used.add(key);
      out.push({ key, id, label: makeLabel(it), raw: it });
    });
    return out;
  }, [areas]);

  // ---------- 선택에 따라 리스트 갱신 ----------
  useEffect(() => {
    // 선택 안 했으면 리스트 비움
    if (!selectedId) {
      setList([]) else 
      {[]};
      return;
    }

    // B-1) “다른 엔드포인트로 재조회” 하고 싶을 때
    if (CHILD_URL_BASE) {
      let abort = false;
      (async () => {
        setLoading(true);
        setError("");
        try {
          const u = new URL(CHILD_URL_BASE);
          const sp = new URLSearchParams(u.search);
          sp.set(CHILD_PARAM_KEY, selectedId);
          if (!sp.has("_type")) sp.set("_type", "json"); // JSON 강제
          u.search = sp.toString();

          const r = await fetch(u.toString());
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          const ct = r.headers.get("content-type") || "";
          if (!ct.includes("application/json")) {
            throw new Error("");
          }
          const data = await r.json();
          const arr = dedupeById(normalize(data));
          if (!abort) setList(arr);
        } catch (e) {
          if (!abort) setError(e.message || String(e));
        } finally {
          if (!abort) setLoading(false);
        }
      })();
      return () => {
        // eslint-disable-next-line no-unused-vars
        let abort = true;
      };
    }

    // B-2) “같은 데이터에서 필터링”만 하고 싶을 때 (CHILD_URL_BASE 비어 있으면 여기로)
    const filtered = areas.filter((it) => makeId(it) === String(selectedId));
    setList(filtered);
  }, [selectedId, areas]);

  // 리스트 렌더용 key(중복 방지)
  const itemKey = (it, idx) => {

    const base =
      it.sigungucode ??
      it.no ??
      `${makeId(it)}_${idx}`;
    return String(base);
  };

  const pickTitle = (it) =>
  String(
    it.title ??
      makeLabel(it)
  );

const pickUpdated = (it) =>
  (
    it.modifiedtime ??
      ""
  );

const pickImage = (it) =>
  it.firstimage1 ??
  it.firstimage2 ??
  ""; // 없으면 빈 문자열


  function redirectBack() {
    navigate(-1); //바로 이전 페이지, -2는 두 페이지 전으로.
  }

  return (
    <>
    <div style={{ padding: 12 }}>
      <label>
        지역 선택:&nbsp;
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          disabled={loading || !!error || options.length === 0}
        >
          <option value="">-- 선택 --</option>
          {options.map((o) => (
            <option key={o.key} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <div style={{ marginTop: 8, fontSize: 13 }}>
        {loading && "불러오는 중…"}
        {error && <span style={{ color: "crimson" }}>에러: {error}</span>}

      </div>

      <hr style={{ margin: "12px 0" }} />

      <div>
        <strong>선택된 ID:</strong> {selectedId || "(없음)"}
      </div>

      {/* 카드 그리드 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 12,
          alignItems: "start",
        }} 
      >
        {list.map((it, idx) => {
          const key = itemKey(it, idx);
          const title = pickTitle(it);
          const updated = pickUpdated(it);
          const img = pickImage(it);
          return (
            <article className="card"
              key={key}
              style={{
                border: "3px solid rgb(53, 36, 11)",
                borderRadius: 12,
                overflow: "visible",
                backgroundColor: "#a79e84",
              }}
            >
              {/* 이미지 */}
              <div
                style={{
                  border: "3px solid #e5e5e5",
                  width: "100%",
                  height: 140,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {img ? (
                  <img
                    src={img}
                    alt={title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    loading="lazy"
                  />
                ) : (
                  <span style={{ color: "#999", fontSize: 12 }}>이미지 없음</span>
                )}
              </div>

              {/* 본문 */}
              <div style={{ padding: 12 }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 16,
                    lineHeight: 1.3,
                  }}
                  title={title}
                >
                  {title}
                </h3>
                <div
                  style={{
                    marginTop: 6,
                    fontSize: 12,
                    color: "#666",
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <p className="updatedtime" style={{fontSize: 16,}}>업데이트일: {updated.slice(-14).slice(0,8)}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {!loading && !error && selectedId && list.length === 0 && (
        <p style={{ marginTop: 12 }}>해당 ID로 표시할 항목이 없습니다.</p>
      )}
    </div>
    </>
  );
}