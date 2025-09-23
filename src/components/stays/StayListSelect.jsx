import './StayListSelect.css';
import { useState, useMemo } from "react";

const DATA = {
  "서울": {
    "중구": ["황학동", "정동", "신당동"],
    "종로구": ["숭인동", "부암동", "익선동"],
  },
  "대구": {
    "달서구": ["상인동", "대곡동", "진천동"],
    "중구": ["동인동", "대봉동", "삼덕동"],
  },
};

export default function StayListSelect() {
  const [lvl1, setLvl1] = useState("");          // 대분류
  const [lvl2, setLvl2] = useState("");          // 중분류
  const [lvl3, setLvl3] = useState("");          // 소분류

  const lvl1Options = Object.keys(DATA);
  const lvl2Options = useMemo(
    () => (lvl1 ? Object.keys(DATA[lvl1]) : []),
    [lvl1]
  );
  const lvl3Options = useMemo(
    () => (lvl1 && lvl2 ? DATA[lvl1][lvl2] : []),
    [lvl1, lvl2]
  );

  // 부모 변경 시 자식 리셋
  const onLvl1 = (e) => { setLvl1(e.target.value); setLvl2(""); setLvl3(""); };
  const onLvl2 = (e) => { setLvl2(e.target.value); setLvl3(""); };
  const onLvl3 = (e) => { setLvl3(e.target.value); };

  return (
    <div style={{ display: "flex", gap: 8, maxWidth: 770}}>
      <label>
        시/도
        <select value={lvl1} onChange={onLvl1}>
          <option value="">선택</option>
          {lvl1Options.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
      </label>

      <label>
        군/구
        <select value={lvl2} onChange={onLvl2} disabled={!lvl1}>
          <option value="">{lvl1 ? "선택" : "시/도 먼저"}</option>
          {lvl2Options.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
      </label>

      <label>
        읍/면/동
        <select value={lvl3} onChange={onLvl3} disabled={!lvl2}>
          <option value="">{lvl2 ? "선택" : "군/구 먼저"}</option>
          {lvl3Options.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
      </label>

      <output>
        <br />
        숙박지: {lvl1 || "-"} &gt; {lvl2 || "-"} &gt; {lvl3 || "-"}
      </output>
    </div>
  );
}
