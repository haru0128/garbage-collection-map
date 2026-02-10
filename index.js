const map = L.map('map').setView([33.580, 133.530], 11);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// 高知市全域をカバーする詳細データベース
const areaDatabase = [
    // --- 山間部 (月木グループ) ---
    { names: ["鏡", "大利", "おおり", "白岩", "しろいわ", "今井", "吉原", "草峰", "小切山", "去坂", "的野"], pos: [33.618, 133.463], group: "月木", label: "鏡地区" },
    { names: ["土佐山", "とさやま", "弘瀬", "ひろせ", "高川", "桑尾", "東川", "都網", "梶谷", "西川"], pos: [33.655, 133.534], group: "月木", label: "土佐山地区" },
    { names: ["網川", "あじかわ", "円行寺", "えんぎょうじ", "宗安寺", "そうあんじ", "柴巻"], pos: [33.595, 133.505], group: "月木", label: "北部山寄りエリア" },
    
    // --- 西部・中心部 (月木グループ) ---
    { names: ["旭", "あさひ", "鴨田", "かもだ", "朝倉", "あさくら", "福井", "ふくい", "万々", "まま", "上町", "本町"], pos: [33.556, 133.508], group: "月木", label: "旭・朝倉エリア" },
    { names: ["帯屋町", "おびやまち", "追手筋", "おうてすじ", "丸ノ内", "廿代町", "永国寺町", "北門前町", "大橋通"], pos: [33.562, 133.538], group: "月木", label: "中心街エリア" },
    { names: ["神田", "こうだ", "竹島", "たけしま", "石立", "いしたて", "筆山", "ひつざん"], pos: [33.545, 133.515], group: "月木", label: "神田・竹島エリア" },
    
    // --- 南部 (月木グループ) ---
    { names: ["春野", "はるの", "弘岡", "ひろおか", "芳原", "よしわら", "内ノ谷", "西分", "秋山", "平和"], pos: [33.495, 133.485], group: "月木", label: "春野エリア" },
    { names: ["横浜", "よこはま", "瀬戸", "せと", "長浜", "ながはま", "浦戸", "うらど", "御畳瀬", "みませ", "桂浜"], pos: [33.515, 133.540], group: "月木", label: "横浜・瀬戸・長浜エリア" },
    { names: ["潮江", "うしおえ", "桟橋", "さんばし", "北新田", "南新田", "幸町", "梅ノ辻"], pos: [33.545, 133.545], group: "月木", label: "潮江・桟橋エリア" },
    
    // --- 東部 (火金グループ) ---
    { names: ["一宮", "いっく", "秦", "はだ", "愛宕", "あたご", "比島", "ひじま", "薊野", "あぞうの", "重倉", "久礼野"], pos: [33.585, 133.560], group: "火金", label: "一宮・秦・薊野エリア" },
    { names: ["高須", "たかす", "大津", "おおつ", "介良", "けら", "布師田", "ぬのしだ", "潮見台", "葛島"], pos: [33.565, 133.610], group: "火金", label: "高須・大津・介良エリア" },
    { names: ["五台山", "ごだいさん", "三里", "みさと", "仁井田", "にいだ", "種崎", "たねざき", "吸江"], pos: [33.540, 133.590], group: "火金", label: "五台山・三里エリア" },
    { names: ["知寄町", "ちより", "下知", "しもじ", "九反田", "くたんだ", "弥生町", "宝永町", "日の出町"], pos: [33.558, 133.565], group: "火金", label: "下知・宝永エリア" }
];

// バランスよくピンを配置
areaDatabase.forEach(item => {
    const isRural = item.label.includes("鏡") || item.label.includes("土佐山") || item.label.includes("春野");
    const count = isRural ? 10 : 5; // 山間部は面積が広いためピンをさらに増量
    const jitter = isRural ? 0.05 : 0.025;

    for(let i=0; i < count; i++) {
        const lat = item.pos[0] + (Math.random() - 0.5) * jitter;
        const lng = item.pos[1] + (Math.random() - 0.5) * jitter;
        const color = item.group === "月木" ? "#d63031" : "#0984e3";
        const dayTxt = item.group === "月木" ? "月曜・木曜" : "火曜・金曜";

        L.circleMarker([lat, lng], { radius: 9, fillColor: color, color: "#fff", weight: 2, fillOpacity: 0.8 }).addTo(map)
        .bindPopup(`<b>${item.label}</b><br>可燃：${dayTxt}<br>プラ：水曜日`);
    }
});

function findArea() {
    const val = document.getElementById('target').value.trim().toLowerCase();
    const info = document.getElementById('res-box');
    if (!val) return;

    // 「ひらがな」でも「漢字」でも、一部が含まれていればヒットするように検索
    const hit = areaDatabase.find(a => a.names.some(name => name.includes(val)));

    if (hit) {
        map.setView(hit.pos, 15);
        const dayClass = hit.group === "月木" ? "red" : "blue";
        const dayTxt = hit.group === "月木" ? "月曜・木曜" : "火曜・金曜";
        info.innerHTML = `<strong>${val} 地区</strong><br>可燃：<span class="${dayClass}">${dayTxt}</span><br>プラ：毎週水曜日`;
        info.style.display = 'block';
    } else {
        alert("「" + val + "」が見つかりませんでした。\n「万々」「瀬戸」「鏡」など、町名や集落名のみで入力してください。");
    }
}

document.getElementById('searchBtn').addEventListener('click', findArea);
