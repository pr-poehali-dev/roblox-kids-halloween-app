import { useState, useEffect, useCallback, useRef } from "react";
import Icon from "@/components/ui/icon";

const PUMPKIN_IMG = "https://cdn.poehali.dev/projects/95aaf91c-f043-4c26-8422-6388d2490af6/files/13070281-8ece-47cd-8090-cafe5f5cdfa7.jpg";
const PETS_IMG = "https://cdn.poehali.dev/projects/95aaf91c-f043-4c26-8422-6388d2490af6/files/d0a2bfa9-8c8c-46d1-abc7-38cea48cdd06.jpg";
const QUEST_IMG = "https://cdn.poehali.dev/projects/95aaf91c-f043-4c26-8422-6388d2490af6/files/40c75b4e-bbb4-4165-a2d9-73a67c4ec2d4.jpg";

type Tab = "home" | "characters" | "quests" | "pets" | "achievements" | "servers";

const characters = [
  { name: "Тыква Пит", emoji: "🎃", role: "Весельчак", color: "#FF7A00", desc: "Самый улыбчивый житель Хэллоуин-мира!", rarity: "Обычный", power: 45 },
  { name: "Призрак Буу", emoji: "👻", role: "Путешественник", color: "#A855F7", desc: "Может проходить сквозь стены и видеть всё!", rarity: "Редкий", power: 72 },
  { name: "Ведьма Лили", emoji: "🧙‍♀️", role: "Волшебница", color: "#EC4899", desc: "Варит самые вкусные зелья из конфет!", rarity: "Эпический", power: 88 },
  { name: "Кот Мряу", emoji: "🐱", role: "Хитрец", color: "#6366F1", desc: "Знает все секреты тёмного леса!", rarity: "Редкий", power: 61 },
  { name: "Зомби Бобби", emoji: "🧟", role: "Силач", color: "#39D353", desc: "Добрый зомби, любит угощать конфетами!", rarity: "Обычный", power: 55 },
  { name: "Дракула Влад", emoji: "🧛", role: "Граф", color: "#EF4444", desc: "Превращается в летучую мышь за секунду!", rarity: "Легендарный", power: 99 },
];

const quests = [
  {
    id: 1, title: "Сбор конфет", emoji: "🍬",
    desc: "Обойди все дома и собери 100 конфет до полуночи!",
    reward: "150 монет + редкий костюм",
    difficulty: "Лёгкий", color: "#FF7A00", progress: 65,
    steps: ["Найди карту деревни", "Посети 10 домов", "Собери 100 конфет", "Вернись до 12:00"],
  },
  {
    id: 2, title: "Загадка призрака", emoji: "👻",
    desc: "Помоги призраку Буу найти его потерянную шляпу!",
    reward: "300 монет + питомец-призрак",
    difficulty: "Средний", color: "#A855F7", progress: 30,
    steps: ["Поговори с призраком", "Найди 3 подсказки", "Отыщи шляпу в замке", "Верни шляпу"],
  },
  {
    id: 3, title: "Замок ужасов", emoji: "🏰",
    desc: "Исследуй старый замок и победи злую тыкву-короля!",
    reward: "500 монет + легендарный меч",
    difficulty: "Сложный", color: "#EF4444", progress: 10,
    steps: ["Найди вход в замок", "Пройди 5 комнат", "Собери 3 ключа", "Победи Короля Тыкву"],
  },
  {
    id: 4, title: "Варим зелье", emoji: "🧪",
    desc: "Помоги ведьме Лили сварить зелье невидимости!",
    reward: "200 монет + волшебная палочка",
    difficulty: "Средний", color: "#EC4899", progress: 80,
    steps: ["Найди летучую мышь", "Собери лунные грибы", "Достань паутину", "Свари зелье"],
  },
];

const pets = [
  { name: "Малыш-призрак", emoji: "👻", color: "#A855F7", owned: true, level: 5, mood: "😄", food: "🍬", ability: "Невидимость" },
  { name: "Летучая мышь", emoji: "🦇", color: "#6366F1", owned: true, level: 3, mood: "😊", food: "🍇", ability: "Полёт" },
  { name: "Котик-ведьма", emoji: "🐈‍⬛", color: "#EC4899", owned: false, level: 0, mood: "😴", food: "🐟", ability: "Удача" },
  { name: "Паук Арни", emoji: "🕷️", color: "#39D353", owned: false, level: 0, mood: "😐", food: "🦟", ability: "Ловушки" },
  { name: "Скелет-щенок", emoji: "💀", color: "#FF7A00", owned: true, level: 7, mood: "🥰", food: "🦴", ability: "Атака" },
  { name: "Тыква-дракон", emoji: "🐉", color: "#EF4444", owned: false, level: 0, mood: "😤", food: "🔥", ability: "Огонь" },
];

const achievements = [
  { title: "Первые шаги", emoji: "👣", desc: "Начал своё приключение", earned: true, points: 10, color: "#FF7A00" },
  { title: "Коллекционер конфет", emoji: "🍬", desc: "Собрал 500 конфет", earned: true, points: 50, color: "#EC4899" },
  { title: "Укротитель призраков", emoji: "👻", desc: "Подружился с 3 призраками", earned: true, points: 75, color: "#A855F7" },
  { title: "Хозяин питомцев", emoji: "🐾", desc: "Завёл 3 питомца", earned: true, points: 100, color: "#39D353" },
  { title: "Исследователь замка", emoji: "🏰", desc: "Исследовал все комнаты замка", earned: false, points: 200, color: "#EF4444" },
  { title: "Чемпион квестов", emoji: "🏆", desc: "Выполнил 10 квестов", earned: false, points: 300, color: "#FFD700" },
  { title: "Дружок всех монстров", emoji: "🧟", desc: "Познакомился со всеми персонажами", earned: false, points: 250, color: "#6366F1" },
  { title: "Повелитель ночи", emoji: "🌙", desc: "Провёл 10 ночей в мире хэллоуина", earned: false, points: 500, color: "#A855F7" },
];

const servers = [
  {
    id: "dendi",
    name: "Мир Денди",
    emoji: "🎮",
    color: "#FF7A00",
    bg: "linear-gradient(135deg, #3D1A00 0%, #1A0A00 100%)",
    desc: "Классический хэллоуинский мир в стиле ретро-аркады! Собирай монеты, избегай монстров.",
    players: 312,
    maxPlayers: 500,
    status: "online",
    tags: ["Ретро", "Аркада", "PvE"],
    features: ["🍄 Ретро-пиксели", "👾 Монстры-аркадники", "🏅 Таблица рекордов", "🎵 Чиптюн музыка"],
    game: {
      description: "Ты попадаешь в пиксельный хэллоуинский мир! Управляй своим персонажем, собирай тыквы и убегай от монстров.",
      goal: "Собери 50 тыкв за 3 минуты",
      controls: ["⬆️⬇️⬅️➡️ — движение", "🅰️ — прыжок", "🅱️ — атака"],
    },
  },
  {
    id: "brookhaven",
    name: "Брукхейвен",
    emoji: "🏘️",
    color: "#A855F7",
    bg: "linear-gradient(135deg, #1A0A3D 0%, #0A001A 100%)",
    desc: "Жуткий хэллоуинский город! Исследуй дома, знакомься с жителями и находи секреты.",
    players: 891,
    maxPlayers: 1000,
    status: "online",
    tags: ["Ролевая", "Город", "Исследование"],
    features: ["🏠 Дома с секретами", "👥 До 1000 игроков", "🛒 Магазин костюмов", "🌙 День/Ночь смена"],
    game: {
      description: "Добро пожаловать в Брукхейвен — город, где каждый дом скрывает тайну! Общайся, исследуй, веселись.",
      goal: "Найди все 7 скрытых тыкв в городе",
      controls: ["Клик — взаимодействие", "E — открыть инвентарь", "M — карта города"],
    },
  },
  {
    id: "99nights",
    name: "99 Ночей",
    emoji: "🌙",
    color: "#39D353",
    bg: "linear-gradient(135deg, #001A0A 0%, #0A1A00 100%)",
    desc: "Выживи 99 страшных ночей подряд! Каждая ночь сложнее предыдущей. Ты справишься?",
    players: 156,
    maxPlayers: 300,
    status: "online",
    tags: ["Выживание", "Хоррор", "Хардкор"],
    features: ["💀 99 уровней сложности", "🧟 Разные монстры", "🔥 Ловушки и бонусы", "🏆 Эксклюзивные награды"],
    game: {
      description: "Самый страшный режим! Каждую ночь появляются новые монстры. Продержись как можно дольше!",
      goal: "Пережить как можно больше ночей",
      controls: ["WASD — движение", "Пробел — прыжок", "E — использовать предмет"],
    },
  },
];

const rarityColor: Record<string, string> = {
  "Обычный": "#9CA3AF",
  "Редкий": "#60A5FA",
  "Эпический": "#A855F7",
  "Легендарный": "#FFD700",
};

// ─── Tile types ───────────────────────────────────────────────────────────────
// 0=floor 1=wall 2=door(closed) 3=door(open) 4=item 5=enemy-spawn 6=chest
const TILE = { FLOOR: 0, WALL: 1, DOOR: 2, DOOR_OPEN: 3, ITEM: 4, SPAWN: 5, CHEST: 6 } as const;
const TS = 36; // tile size px

// Per-server map configs
const MAPS: Record<string, { tiles: number[][], items: {r:number,c:number,emoji:string,name:string,pts:number}[], enemies: {r:number,c:number,emoji:string,hp:number}[], bg: string, wall: string, floor: string }> = {
  dendi: {
    bg: "#1A0500", wall: "#8B2500", floor: "#2D1000",
    tiles: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1,0,0,0,0,0,0,1],
      [1,0,4,0,0,0,2,0,0,4,0,0,0,1],
      [1,0,0,0,5,0,1,0,5,0,0,0,0,1],
      [1,0,0,0,0,0,1,0,0,0,0,6,0,1],
      [1,1,2,1,1,1,1,1,1,2,1,1,1,1],
      [1,0,0,0,0,0,1,0,0,0,0,0,0,1],
      [1,0,6,0,5,0,1,0,4,0,5,0,0,1],
      [1,0,0,0,0,0,2,0,0,0,0,0,0,1],
      [1,0,4,0,0,0,1,0,0,0,0,6,0,1],
      [1,0,0,0,0,0,1,0,5,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    items: [
      {r:2,c:2,emoji:"🎃",name:"Тыква",pts:15},
      {r:2,c:9,emoji:"🍬",name:"Конфета",pts:10},
      {r:9,c:2,emoji:"🎃",name:"Тыква",pts:15},
      {r:6,c:8,emoji:"🍬",name:"Конфета",pts:10},
    ],
    enemies: [
      {r:3,c:4,emoji:"👾",hp:2},
      {r:3,c:8,emoji:"👾",hp:2},
      {r:7,c:4,emoji:"👾",hp:3},
      {r:10,c:8,emoji:"👾",hp:2},
    ],
  },
  brookhaven: {
    bg: "#0A0020", wall: "#3D1A6E", floor: "#180840",
    tiles: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,1,0,0,0,0,1,0,0,0,1],
      [1,0,4,0,1,0,6,0,0,1,0,4,0,1],
      [1,0,0,0,2,0,0,0,5,2,0,0,0,1],
      [1,1,2,1,1,0,0,0,0,1,1,2,1,1],
      [1,0,0,0,0,0,5,0,0,0,0,0,0,1],
      [1,0,6,0,0,0,0,0,0,0,0,6,0,1],
      [1,0,0,0,5,0,0,0,5,0,0,0,0,1],
      [1,1,2,1,1,1,2,1,1,1,2,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,4,0,5,0,4,0,5,0,4,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    items: [
      {r:2,c:2,emoji:"🏚️",name:"Ключ от дома",pts:20},
      {r:2,c:11,emoji:"🔑",name:"Золотой ключ",pts:30},
      {r:10,c:2,emoji:"🕯️",name:"Свеча",pts:10},
      {r:10,c:6,emoji:"🏚️",name:"Ключ от дома",pts:20},
      {r:10,c:10,emoji:"🕯️",name:"Свеча",pts:10},
    ],
    enemies: [
      {r:3,c:8,emoji:"🧟",hp:3},
      {r:5,c:6,emoji:"🧟",hp:2},
      {r:7,c:4,emoji:"🧟",hp:3},
      {r:7,c:8,emoji:"🧟",hp:2},
      {r:10,c:4,emoji:"🧟",hp:3},
      {r:10,c:8,emoji:"🧟",hp:4},
    ],
  },
  "99nights": {
    bg: "#001A00", wall: "#0A3D0A", floor: "#001500",
    tiles: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,6,0,1,1,2,1,1,0,0,6,0,1],
      [1,0,0,0,1,0,0,0,1,0,5,0,0,1],
      [1,5,0,0,2,0,4,0,2,0,0,0,5,1],
      [1,0,0,0,1,0,5,0,1,0,0,0,0,1],
      [1,0,1,1,1,1,2,1,1,1,1,0,0,1],
      [1,0,1,0,0,0,0,0,0,0,1,0,5,1],
      [1,5,2,0,6,0,5,0,6,0,2,0,0,1],
      [1,0,1,0,0,0,0,0,0,0,1,0,0,1],
      [1,0,1,1,1,1,1,1,1,1,1,5,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    items: [
      {r:2,c:2,emoji:"🌙",name:"Лунный камень",pts:25},
      {r:2,c:11,emoji:"🌙",name:"Лунный камень",pts:25},
      {r:4,c:6,emoji:"💎",name:"Кристалл ночи",pts:40},
      {r:8,c:4,emoji:"🌙",name:"Лунный камень",pts:25},
      {r:8,c:8,emoji:"💎",name:"Кристалл ночи",pts:40},
    ],
    enemies: [
      {r:3,c:5,emoji:"💀",hp:4},
      {r:4,c:1,emoji:"💀",hp:3},
      {r:4,c:12,emoji:"💀",hp:3},
      {r:5,c:6,emoji:"💀",hp:5},
      {r:7,c:3,emoji:"💀",hp:4},
      {r:7,c:9,emoji:"💀",hp:4},
      {r:8,c:6,emoji:"💀",hp:6},
    ],
  },
};

const CHEST_LOOT = ["🗡️ Меч призрака", "🛡️ Щит тыквы", "🧪 Зелье силы", "👟 Сапоги ветра", "🎩 Шляпа ведьмы", "💍 Кольцо теней"];

function GameScreen({ server, onExit }: { server: typeof servers[0]; onExit: () => void }) {
  const mapCfg = MAPS[server.id];
  const ROWS = mapCfg.tiles.length;
  const COLS = mapCfg.tiles[0].length;

  // State
  const [playerPos, setPlayerPos] = useState(() => {
    // find first walkable cell near centre
    for (let r = 1; r < ROWS - 1; r++)
      for (let c = 1; c < COLS - 1; c++)
        if (mapCfg.tiles[r][c] === TILE.FLOOR) return { r, c };
    return { r: 1, c: 1 };
  });
  const [doors, setDoors] = useState<Record<string, boolean>>({});         // "r,c" -> open
  const [collectedItems, setCollectedItems] = useState<Set<string>>(new Set());
  const [openedChests, setOpenedChests] = useState<Set<string>>(new Set());
  const [inventory, setInventory] = useState<string[]>([]);
  const [enemies, setEnemies] = useState(() => mapCfg.enemies.map((e, i) => ({ ...e, id: i, alive: true, curHp: e.hp })));
  const [hp, setHp] = useState(5);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState<{ text: string; color: string } | null>(null);
  const [showInventory, setShowInventory] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [night, setNight] = useState(1);
  const msgTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showMsg = useCallback((text: string, color = "#FFD700") => {
    if (msgTimer.current) clearTimeout(msgTimer.current);
    setMessage({ text, color });
    msgTimer.current = setTimeout(() => setMessage(null), 1200);
  }, []);

  // Enemy AI — move toward player every 900ms
  useEffect(() => {
    if (gameOver) return;
    const id = setInterval(() => {
      setEnemies(prev => prev.map(e => {
        if (!e.alive) return e;
        const dr = Math.sign(playerPos.r - e.r);
        const dc = Math.sign(playerPos.c - e.c);
        // try to move one step
        const nr = e.r + (Math.random() < 0.6 ? dr : (Math.random() < 0.5 ? 1 : -1));
        const nc = e.c + (Math.random() < 0.6 ? dc : (Math.random() < 0.5 ? 1 : -1));
        const safe = nr > 0 && nr < ROWS - 1 && nc > 0 && nc < COLS - 1;
        const tile = safe ? mapCfg.tiles[nr][nc] : TILE.WALL;
        const blocked = tile === TILE.WALL || (tile === TILE.DOOR && !doors[`${nr},${nc}`]);
        return blocked ? e : { ...e, r: nr, c: nc };
      }));
    }, 900);
    return () => clearInterval(id);
  }, [gameOver, playerPos, doors, ROWS, COLS, mapCfg.tiles]);

  // Check enemy collision
  useEffect(() => {
    if (gameOver) return;
    const hit = enemies.find(e => e.alive && e.r === playerPos.r && e.c === playerPos.c);
    if (hit) {
      setHp(prev => {
        const next = prev - 1;
        if (next <= 0) { setGameOver(true); showMsg("💀 Ты проиграл!", "#EF4444"); }
        else showMsg(`💥 Удар! ❤️×${next}`, "#EF4444");
        return Math.max(0, next);
      });
      // push player back
      setPlayerPos(p => ({ r: Math.min(ROWS - 2, Math.max(1, p.r + (Math.random() < 0.5 ? -1 : 1))), c: Math.min(COLS - 2, Math.max(1, p.c + (Math.random() < 0.5 ? -1 : 1))) }));
    }
  }, [enemies, playerPos, gameOver, showMsg, ROWS, COLS]);

  const tryMove = useCallback((dr: number, dc: number) => {
    if (gameOver) return;
    setPlayerPos(prev => {
      const nr = prev.r + dr;
      const nc = prev.c + dc;
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return prev;
      const tile = mapCfg.tiles[nr][nc];
      const key = `${nr},${nc}`;

      // Wall — blocked
      if (tile === TILE.WALL) return prev;

      // Closed door — open it
      if (tile === TILE.DOOR && !doors[key]) {
        setDoors(d => ({ ...d, [key]: true }));
        showMsg("🚪 Дверь открыта!", "#FF7A00");
        return prev;
      }

      // Collect item
      const item = mapCfg.items.find(it => it.r === nr && it.c === nc && !collectedItems.has(`${it.r},${it.c}`));
      if (item) {
        setCollectedItems(s => new Set(s).add(`${item.r},${item.c}`));
        setScore(s => s + item.pts);
        showMsg(`${item.emoji} +${item.pts} очков!`, "#FFD700");
      }

      // Open chest
      if (tile === TILE.CHEST && !openedChests.has(key)) {
        setOpenedChests(s => new Set(s).add(key));
        const loot = CHEST_LOOT[Math.floor(Math.random() * CHEST_LOOT.length)];
        setInventory(inv => [...inv, loot]);
        setScore(s => s + 50);
        showMsg(`📦 ${loot}`, "#A855F7");
      }

      // Attack adjacent enemy
      const enemy = enemies.find(e => e.alive && e.r === nr && e.c === nc);
      if (enemy) {
        setEnemies(es => es.map(e => {
          if (e.id !== enemy.id) return e;
          const newHp = e.curHp - 1;
          if (newHp <= 0) {
            setScore(s => s + 30);
            showMsg("⚔️ Враг побеждён! +30", "#39D353");
            return { ...e, alive: false, curHp: 0 };
          }
          showMsg(`⚔️ Удар! ❤️×${newHp}`, "#FF7A00");
          return { ...e, curHp: newHp };
        }));
        return prev; // don't move into enemy cell
      }

      return { r: nr, c: nc };
    });
  }, [gameOver, ROWS, COLS, mapCfg, doors, collectedItems, openedChests, enemies, showMsg]);

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "w") { e.preventDefault(); tryMove(-1, 0); }
      if (e.key === "ArrowDown" || e.key === "s") { e.preventDefault(); tryMove(1, 0); }
      if (e.key === "ArrowLeft" || e.key === "a") { e.preventDefault(); tryMove(0, -1); }
      if (e.key === "ArrowRight" || e.key === "d") { e.preventDefault(); tryMove(0, 1); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [tryMove]);

  const allCollected = collectedItems.size === mapCfg.items.length;
  const win = allCollected && enemies.every(e => !e.alive);

  // 99nights — on win advance night
  const nextNight = () => {
    setNight(n => n + 1);
    setHp(5);
    setScore(s => s + 100);
    setCollectedItems(new Set());
    setOpenedChests(new Set());
    setDoors({});
    setEnemies(mapCfg.enemies.map((e, i) => ({ ...e, id: i, alive: true, curHp: e.hp + night })));
    setPlayerPos({ r: 1, c: 1 });
  };

  const restart = () => {
    setHp(5); setScore(0); setNight(1); setGameOver(false);
    setCollectedItems(new Set()); setOpenedChests(new Set()); setDoors({});
    setEnemies(mapCfg.enemies.map((e, i) => ({ ...e, id: i, alive: true, curHp: e.hp })));
    setInventory([]); setPlayerPos({ r: 1, c: 1 });
  };

  // Camera: centre on player, clamp to map bounds
  const viewW = Math.min(10, COLS);
  const viewH = Math.min(9, ROWS);
  const camC = Math.max(0, Math.min(COLS - viewW, playerPos.c - Math.floor(viewW / 2)));
  const camR = Math.max(0, Math.min(ROWS - viewH, playerPos.r - Math.floor(viewH / 2)));

  const getTileStyle = (tile: number, r: number, c: number): React.CSSProperties => {
    const key = `${r},${c}`;
    if (tile === TILE.WALL) return { background: mapCfg.wall, border: `1px solid ${mapCfg.wall}cc` };
    if (tile === TILE.DOOR) return doors[key] ? { background: mapCfg.floor, border: `1px solid #FF7A0066` } : { background: "#8B5A00", border: "1px solid #FF7A00" };
    if (tile === TILE.CHEST) return { background: mapCfg.floor, border: `1px solid ${openedChests.has(key) ? "#33333366" : "#A855F7"}` };
    if (tile === TILE.ITEM) return { background: mapCfg.floor, border: "none" };
    if (tile === TILE.SPAWN) return { background: mapCfg.floor, border: "none" };
    return { background: mapCfg.floor, border: `1px solid ${mapCfg.floor}88` };
  };

  return (
    <div className="rounded-2xl overflow-hidden select-none" style={{ border: `2px solid ${server.color}66` }}>
      {/* HUD */}
      <div className="flex items-center justify-between px-3 py-2 gap-2 flex-wrap" style={{ background: "rgba(0,0,0,0.7)" }}>
        <div className="flex gap-2 text-xs font-bold flex-wrap">
          <span style={{ color: "#EF4444" }}>{"❤️".repeat(hp)}</span>
          <span style={{ color: "#FFD700" }}>⭐ {score}</span>
          <span style={{ color: server.color }}>📦 {mapCfg.items.length - collectedItems.size} предм.</span>
          {server.id === "99nights" && <span style={{ color: "#39D353" }}>🌙 Ночь {night}</span>}
        </div>
        <div className="flex gap-1">
          <button onClick={() => setShowInventory(v => !v)}
            className="text-xs px-2 py-1 rounded-lg font-bold"
            style={{ background: showInventory ? "#A855F766" : "rgba(255,255,255,0.1)", color: "#A855F7", border: "1px solid #A855F755" }}>
            🎒 {inventory.length}
          </button>
          <button onClick={onExit} className="text-xs px-2 py-1 rounded-lg font-bold" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,200,150,0.7)" }}>✕</button>
        </div>
      </div>

      {/* Inventory panel */}
      {showInventory && (
        <div className="px-3 py-2 animate-slide-up" style={{ background: "rgba(139,63,191,0.15)", borderBottom: "1px solid #A855F733" }}>
          <p className="text-xs font-bold mb-1" style={{ color: "#A855F7" }}>🎒 Инвентарь</p>
          {inventory.length === 0
            ? <p className="text-xs" style={{ color: "rgba(255,200,150,0.4)" }}>Пусто — открывай сундуки!</p>
            : <div className="flex flex-wrap gap-1">{inventory.map((it, i) => (
                <span key={i} className="text-xs px-2 py-1 rounded-lg" style={{ background: "rgba(139,63,191,0.3)", color: "#E9D5FF" }}>{it}</span>
              ))}</div>
          }
        </div>
      )}

      {/* Map viewport */}
      <div className="relative overflow-hidden" style={{ background: mapCfg.bg, height: viewH * TS }}>
        {/* Tile grid */}
        <div style={{ position: "absolute", top: 0, left: 0 }}>
          {Array.from({ length: viewH }, (_, vr) => {
            const r = camR + vr;
            return (
              <div key={r} style={{ display: "flex" }}>
                {Array.from({ length: viewW }, (_, vc) => {
                  const c = camC + vc;
                  const tile = r < ROWS && c < COLS ? mapCfg.tiles[r][c] : TILE.WALL;
                  const key = `${r},${c}`;
                  const isPlayer = r === playerPos.r && c === playerPos.c;
                  const enemy = enemies.find(e => e.alive && e.r === r && e.c === c);
                  const item = mapCfg.items.find(it => it.r === r && it.c === c && !collectedItems.has(key));
                  const isChest = tile === TILE.CHEST && !openedChests.has(key);
                  const isDoorClosed = tile === TILE.DOOR && !doors[key];

                  return (
                    <div key={c} style={{ width: TS, height: TS, position: "relative", flexShrink: 0, ...getTileStyle(tile, r, c) }}>
                      {/* Door indicator */}
                      {isDoorClosed && (
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🚪</div>
                      )}
                      {/* Chest */}
                      {isChest && (
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📦</div>
                      )}
                      {/* Item */}
                      {item && (
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, animation: "float3 2s ease-in-out infinite" }}>{item.emoji}</div>
                      )}
                      {/* Enemy */}
                      {enemy && !isPlayer && (
                        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1 }}>
                          <div style={{ fontSize: 18, lineHeight: 1 }}>{enemy.emoji}</div>
                          <div style={{ display: "flex", gap: 1 }}>
                            {Array.from({ length: enemy.curHp }, (_, i) => (
                              <div key={i} style={{ width: 4, height: 4, borderRadius: 2, background: "#EF4444" }} />
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Player */}
                      {isPlayer && (
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, zIndex: 10, filter: "drop-shadow(0 0 4px #FF7A00)" }}>🧒</div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Floating message */}
        {message && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full z-20 whitespace-nowrap"
            style={{ background: "rgba(0,0,0,0.85)", color: message.color, border: `1px solid ${message.color}55` }}>
            {message.text}
          </div>
        )}

        {/* Overlays */}
        {(gameOver || win) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20" style={{ background: "rgba(0,0,0,0.88)" }}>
            <div className="text-4xl mb-2">{win ? "🏆" : "💀"}</div>
            <div className="font-spooky text-xl mb-1" style={{ color: win ? server.color : "#EF4444" }}>
              {win ? (server.id === "99nights" ? `Ночь ${night} пройдена!` : "Победа!") : "Игра окончена!"}
            </div>
            <div className="text-sm mb-3" style={{ color: "rgba(255,200,150,0.7)" }}>Счёт: {score}</div>
            {win && server.id === "99nights"
              ? <button onClick={nextNight} className="px-4 py-2 rounded-xl font-bold text-sm block-btn" style={{ background: server.color, color: "#0D0520" }}>🌙 Ночь {night + 1}</button>
              : <button onClick={restart} className="px-4 py-2 rounded-xl font-bold text-sm block-btn" style={{ background: server.color, color: "#0D0520" }}>🔄 Заново</button>
            }
          </div>
        )}
      </div>

      {/* Hint bar */}
      <div className="px-3 py-1 text-center" style={{ background: "rgba(0,0,0,0.5)" }}>
        <p className="text-xs" style={{ color: "rgba(255,200,150,0.4)" }}>
          {allCollected && !win ? "⚔️ Победи всех врагов!" : "🚪 Подходи к двери чтобы открыть · 📦 Сундук = лут · ⚔️ Иди на врага чтобы ударить"}
        </p>
      </div>

      {/* D-pad controls */}
      <div className="p-3" style={{ background: "rgba(0,0,0,0.6)" }}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col items-center gap-1">
            <button onPointerDown={() => tryMove(-1, 0)} className="w-12 h-11 rounded-xl text-lg font-bold flex items-center justify-center active:scale-95 transition-transform" style={{ background: server.color + "44", color: server.color, border: `2px solid ${server.color}66`, touchAction: "none" }}>▲</button>
            <div className="flex gap-1">
              <button onPointerDown={() => tryMove(0, -1)} className="w-12 h-11 rounded-xl text-lg font-bold flex items-center justify-center active:scale-95 transition-transform" style={{ background: server.color + "44", color: server.color, border: `2px solid ${server.color}66`, touchAction: "none" }}>◀</button>
              <button onPointerDown={() => tryMove(1, 0)} className="w-12 h-11 rounded-xl text-lg font-bold flex items-center justify-center active:scale-95 transition-transform" style={{ background: server.color + "44", color: server.color, border: `2px solid ${server.color}66`, touchAction: "none" }}>▼</button>
              <button onPointerDown={() => tryMove(0, 1)} className="w-12 h-11 rounded-xl text-lg font-bold flex items-center justify-center active:scale-95 transition-transform" style={{ background: server.color + "44", color: server.color, border: `2px solid ${server.color}66`, touchAction: "none" }}>▶</button>
            </div>
          </div>
          <div className="text-xs text-right" style={{ color: "rgba(255,200,150,0.4)" }}>
            <div>Клавиши:</div>
            <div>WASD / ↑↓←→</div>
            <div className="mt-1">Собрано:</div>
            <div style={{ color: server.color }}>{collectedItems.size}/{mapCfg.items.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [selectedChar, setSelectedChar] = useState<number | null>(null);
  const [fedPets, setFedPets] = useState<Record<number, boolean>>({});
  const [questSelected, setQuestSelected] = useState<number | null>(null);
  const [coins] = useState(1240);
  const [xp] = useState(3750);
  const [activeServer, setActiveServer] = useState<string | null>(null);
  const [playingServer, setPlayingServer] = useState<string | null>(null);

  const earnedAch = achievements.filter(a => a.earned).length;
  const totalPoints = achievements.filter(a => a.earned).reduce((s, a) => s + a.points, 0);

  const navItems: { tab: Tab; emoji: string; label: string }[] = [
    { tab: "home", emoji: "🏠", label: "Главная" },
    { tab: "servers", emoji: "🌐", label: "Серверы" },
    { tab: "characters", emoji: "🎭", label: "Персонажи" },
    { tab: "quests", emoji: "⚔️", label: "Квесты" },
    { tab: "pets", emoji: "🐾", label: "Питомцы" },
    { tab: "achievements", emoji: "🏆", label: "Достижения" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #0D0520 0%, #1A0A2E 40%, #0F1A0A 100%)" }}>
      {/* Flying bats */}
      <div className="fixed top-20 left-0 pointer-events-none z-0 animate-bat text-3xl" style={{ animationDelay: "0s" }}>🦇</div>
      <div className="fixed top-44 left-0 pointer-events-none z-0 animate-bat text-2xl" style={{ animationDelay: "6s" }}>🦇</div>

      {/* Stars bg */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: "radial-gradient(1px 1px at 10% 15%, rgba(255,215,0,0.9) 0%, transparent 100%), radial-gradient(1px 1px at 25% 60%, rgba(255,255,255,0.7) 0%, transparent 100%), radial-gradient(2px 2px at 50% 8%, rgba(255,215,0,0.8) 0%, transparent 100%), radial-gradient(1px 1px at 70% 45%, rgba(255,255,255,0.6) 0%, transparent 100%), radial-gradient(1px 1px at 88% 25%, rgba(255,215,0,0.7) 0%, transparent 100%), radial-gradient(1px 1px at 15% 88%, rgba(255,215,0,0.5) 0%, transparent 100%), radial-gradient(2px 2px at 60% 80%, rgba(255,255,255,0.4) 0%, transparent 100%), radial-gradient(1px 1px at 92% 70%, rgba(255,215,0,0.6) 0%, transparent 100%)"
      }} />

      {/* Header */}
      <header className="relative z-10 px-4 pt-5 pb-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl animate-wiggle inline-block">🎃</span>
            <div>
              <h1 className="font-spooky text-xl leading-none" style={{ color: "#FF7A00" }}>Spooky World</h1>
              <p className="text-xs" style={{ color: "rgba(255,200,100,0.7)" }}>Halloween Roblox</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-2xl text-sm font-bold" style={{ background: "rgba(255,122,0,0.2)", border: "2px solid #FF7A00", color: "#FF7A00" }}>
              🪙 {coins.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-2xl text-sm font-bold" style={{ background: "rgba(139,63,191,0.2)", border: "2px solid #A855F7", color: "#A855F7" }}>
              ⚡ {xp.toLocaleString()}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="sticky top-0 z-20 px-4 py-2" style={{ background: "rgba(13,5,32,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(139,63,191,0.3)" }}>
        <div className="max-w-2xl mx-auto flex gap-1">
          {navItems.map(({ tab, emoji, label }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 px-1 rounded-xl text-xs font-bold transition-all duration-200"
              style={{
                background: activeTab === tab ? "rgba(255,122,0,0.2)" : "transparent",
                color: activeTab === tab ? "#FF7A00" : "rgba(255,200,150,0.5)",
                border: activeTab === tab ? "1.5px solid rgba(255,122,0,0.5)" : "1.5px solid transparent",
              }}
            >
              <span className="text-lg">{emoji}</span>
              <span className="hidden sm:block">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="relative z-10 max-w-2xl mx-auto px-4 py-6 pb-10">

        {/* HOME */}
        {activeTab === "home" && (
          <div className="space-y-6 animate-slide-up">
            {/* Hero */}
            <div className="relative rounded-3xl overflow-hidden" style={{ border: "2px solid rgba(255,122,0,0.4)" }}>
              <img src={QUEST_IMG} alt="Хэллоуин мир" className="w-full h-52 object-cover opacity-70" />
              <div className="absolute inset-0 flex flex-col justify-end p-5" style={{ background: "linear-gradient(to top, rgba(13,5,32,0.95) 0%, transparent 55%)" }}>
                <div className="text-4xl mb-2 animate-float inline-block">🎃</div>
                <h2 className="font-spooky text-3xl mb-1 shine-text">Добро пожаловать!</h2>
                <p className="text-sm" style={{ color: "rgba(255,200,150,0.8)" }}>В мире Хэллоуина каждую ночь — новые приключения!</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Квестов", value: "2/4", emoji: "⚔️", color: "#FF7A00" },
                { label: "Питомцев", value: "3/6", emoji: "🐾", color: "#39D353" },
                { label: "Достижений", value: `${earnedAch}/${achievements.length}`, emoji: "🏆", color: "#FFD700" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl p-3 text-center" style={{ background: "rgba(255,255,255,0.05)", border: `2px solid ${s.color}33` }}>
                  <div className="text-2xl mb-1">{s.emoji}</div>
                  <div className="font-bold text-lg" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs" style={{ color: "rgba(255,200,150,0.6)" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Characters preview */}
            <div>
              <h3 className="font-spooky text-xl mb-3" style={{ color: "#FF7A00" }}>🎭 Персонажи</h3>
              <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                {characters.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTab("characters")}
                    className="flex-shrink-0 w-20 rounded-2xl p-3 text-center game-card"
                    style={{ background: `${c.color}22`, border: `2px solid ${c.color}55` }}
                  >
                    <div className="text-3xl mb-1">{c.emoji}</div>
                    <div className="text-xs font-bold" style={{ color: c.color }}>{c.name.split(" ")[0]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Servers preview */}
            <div>
              <h3 className="font-spooky text-xl mb-3" style={{ color: "#39D353" }}>🌐 Игровые серверы</h3>
              <div className="grid grid-cols-3 gap-2">
                {servers.map((s) => (
                  <button key={s.id} onClick={() => setActiveTab("servers")} className="game-card rounded-2xl p-3 text-center" style={{ background: `${s.color}18`, border: `2px solid ${s.color}55` }}>
                    <div className="text-3xl mb-1 animate-float3 inline-block">{s.emoji}</div>
                    <div className="text-xs font-bold leading-tight" style={{ color: s.color }}>{s.name}</div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#39D353" }} />
                      <span className="text-xs" style={{ color: "rgba(255,200,150,0.5)" }}>{s.players}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Active quest */}
            <div>
              <h3 className="font-spooky text-xl mb-3" style={{ color: "#FF7A00" }}>⚔️ Активный квест</h3>
              <div className="rounded-2xl p-4 game-card" style={{ background: "rgba(255,122,0,0.1)", border: "2px solid rgba(255,122,0,0.4)" }} onClick={() => setActiveTab("quests")}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl">🍬</span>
                  <div>
                    <div className="font-bold text-lg" style={{ color: "#FF7A00" }}>Сбор конфет</div>
                    <div className="text-sm" style={{ color: "rgba(255,200,150,0.7)" }}>Собери 100 конфет до полуночи</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs mb-1" style={{ color: "rgba(255,200,150,0.7)" }}>
                  <span>Прогресс</span><span>65%</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                  <div className="h-full rounded-full" style={{ width: "65%", background: "linear-gradient(90deg, #FF7A00, #FFD700)" }} />
                </div>
              </div>
            </div>

            {/* Pets */}
            <div>
              <h3 className="font-spooky text-xl mb-3" style={{ color: "#39D353" }}>🐾 Мои питомцы</h3>
              <div className="rounded-2xl overflow-hidden" style={{ border: "2px solid rgba(57,211,83,0.4)" }}>
                <img src={PETS_IMG} alt="Питомцы" className="w-full h-36 object-cover" />
                <div className="p-3 flex gap-2" style={{ background: "rgba(57,211,83,0.08)" }}>
                  {pets.filter(p => p.owned).map((p, i) => (
                    <button key={i} onClick={() => setActiveTab("pets")} className="flex-1 rounded-xl p-2 text-center game-card" style={{ background: `${p.color}22`, border: `1.5px solid ${p.color}55` }}>
                      <div className="text-2xl">{p.emoji}</div>
                      <div className="text-xs font-bold mt-1" style={{ color: p.color }}>Ур.{p.level}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SERVERS */}
        {activeTab === "servers" && (
          <div className="animate-slide-up space-y-4">
            {/* Header */}
            <div className="rounded-2xl p-4 text-center" style={{ background: "linear-gradient(135deg, rgba(57,211,83,0.15), rgba(168,85,247,0.1))", border: "2px solid rgba(57,211,83,0.35)" }}>
              <div className="text-5xl mb-2 animate-wiggle inline-block">🌐</div>
              <h2 className="font-spooky text-2xl mb-1" style={{ color: "#39D353" }}>Игровые серверы</h2>
              <p className="text-sm" style={{ color: "rgba(255,200,150,0.6)" }}>Выбери мир и начни своё приключение!</p>
            </div>

            {/* Server cards */}
            {servers.map((s) => (
              <div key={s.id}>
                <button
                  className="w-full game-card rounded-2xl overflow-hidden text-left"
                  style={{ border: `2px solid ${activeServer === s.id ? s.color : s.color + "44"}` }}
                  onClick={() => setActiveServer(activeServer === s.id ? null : s.id)}
                >
                  {/* Card top */}
                  <div className="p-4" style={{ background: s.bg }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl animate-float3 inline-block">{s.emoji}</span>
                        <div>
                          <div className="font-spooky text-xl" style={{ color: s.color }}>{s.name}</div>
                          <div className="flex gap-1 mt-1">
                            {s.tags.map(t => (
                              <span key={t} className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: `${s.color}22`, color: s.color }}>{t}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1.5 justify-end mb-1">
                          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#39D353" }} />
                          <span className="text-xs font-bold" style={{ color: "#39D353" }}>Онлайн</span>
                        </div>
                        <div className="text-xs" style={{ color: "rgba(255,200,150,0.5)" }}>
                          👤 {s.players}/{s.maxPlayers}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm mb-3" style={{ color: "rgba(255,200,150,0.8)" }}>{s.desc}</p>

                    {/* Player bar */}
                    <div className="h-2 rounded-full overflow-hidden mb-1" style={{ background: "rgba(255,255,255,0.1)" }}>
                      <div className="h-full rounded-full" style={{ width: `${(s.players / s.maxPlayers) * 100}%`, background: `linear-gradient(90deg, ${s.color}, ${s.color}88)` }} />
                    </div>
                    <div className="text-xs" style={{ color: "rgba(255,200,150,0.4)" }}>{s.players} игроков онлайн</div>
                  </div>

                  {/* Expanded */}
                  {activeServer === s.id && (
                    <div className="p-4 animate-slide-up" style={{ background: `${s.color}0A`, borderTop: `1px solid ${s.color}33` }}>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {s.features.map((f, fi) => (
                          <div key={fi} className="flex items-center gap-2 text-xs rounded-xl p-2" style={{ background: "rgba(255,255,255,0.05)" }}>
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                      <div className="rounded-xl p-3 mb-4" style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${s.color}33` }}>
                        <p className="text-xs font-bold mb-1" style={{ color: s.color }}>🎯 Цель</p>
                        <p className="text-sm font-bold" style={{ color: "rgba(255,200,150,0.9)" }}>{s.game.goal}</p>
                      </div>
                      {playingServer === s.id ? (
                        <GameScreen server={s} onExit={() => setPlayingServer(null)} />
                      ) : (
                        <button
                          className="w-full py-3 rounded-xl font-bold text-base block-btn"
                          style={{ background: s.color, color: "#0D0520" }}
                          onClick={(e) => { e.stopPropagation(); setPlayingServer(s.id); setActiveServer(s.id); }}
                        >
                          🚀 Войти в игру
                        </button>
                      )}
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* CHARACTERS */}
        {activeTab === "characters" && (
          <div className="animate-slide-up">
            <div className="flex items-center gap-3 mb-5">
              <img src={PUMPKIN_IMG} alt="Персонаж" className="w-14 h-14 rounded-2xl object-cover" style={{ border: "2px solid #FF7A00" }} />
              <div>
                <h2 className="font-spooky text-2xl" style={{ color: "#FF7A00" }}>Персонажи</h2>
                <p className="text-sm" style={{ color: "rgba(255,200,150,0.6)" }}>Познакомься с жителями мира!</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {characters.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedChar(selectedChar === i ? null : i)}
                  className="game-card rounded-2xl p-4 text-left"
                  style={{ background: selectedChar === i ? `${c.color}25` : "rgba(255,255,255,0.05)", border: `2px solid ${selectedChar === i ? c.color : c.color + "44"}` }}
                >
                  <div className="text-4xl mb-2 animate-float3 inline-block">{c.emoji}</div>
                  <div className="font-bold text-sm" style={{ color: c.color }}>{c.name}</div>
                  <div className="text-xs mb-2" style={{ color: "rgba(255,200,150,0.6)" }}>{c.role}</div>
                  <div className="inline-block text-xs px-2 py-0.5 rounded-full font-bold mb-2" style={{ background: `${rarityColor[c.rarity]}22`, color: rarityColor[c.rarity], border: `1px solid ${rarityColor[c.rarity]}55` }}>
                    {c.rarity}
                  </div>
                  {selectedChar === i && (
                    <div className="mt-2 animate-slide-up">
                      <p className="text-xs mb-2" style={{ color: "rgba(255,200,150,0.8)" }}>{c.desc}</p>
                      <div className="flex items-center justify-between text-xs mb-1" style={{ color: "rgba(255,200,150,0.6)" }}>
                        <span>Сила</span><span style={{ color: c.color }}>{c.power}/100</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                        <div className="h-full rounded-full" style={{ width: `${c.power}%`, background: `linear-gradient(90deg, ${c.color}, ${c.color}99)` }} />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* QUESTS */}
        {activeTab === "quests" && (
          <div className="animate-slide-up space-y-4">
            <h2 className="font-spooky text-2xl" style={{ color: "#FF7A00" }}>⚔️ Хэллоуинские квесты</h2>
            {quests.map((q) => (
              <div key={q.id}>
                <button
                  className="w-full game-card rounded-2xl p-4 text-left"
                  style={{ background: questSelected === q.id ? `${q.color}18` : "rgba(255,255,255,0.05)", border: `2px solid ${questSelected === q.id ? q.color : q.color + "44"}` }}
                  onClick={() => setQuestSelected(questSelected === q.id ? null : q.id)}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-4xl flex-shrink-0">{q.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold" style={{ color: q.color }}>{q.title}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0 ml-2" style={{ background: `${q.color}22`, color: q.color }}>
                          {q.difficulty}
                        </span>
                      </div>
                      <p className="text-xs mb-2" style={{ color: "rgba(255,200,150,0.7)" }}>{q.desc}</p>
                      <div className="text-xs mb-1 flex justify-between" style={{ color: "rgba(255,200,150,0.5)" }}>
                        <span>Прогресс</span><span>{q.progress}%</span>
                      </div>
                      <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                        <div className="h-full rounded-full" style={{ width: `${q.progress}%`, background: `linear-gradient(90deg, ${q.color}, ${q.color}88)` }} />
                      </div>
                    </div>
                  </div>
                  {questSelected === q.id && (
                    <div className="mt-4 animate-slide-up">
                      <div className="rounded-xl p-3 mb-3" style={{ background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.3)" }}>
                        <p className="text-xs font-bold mb-1" style={{ color: "#FFD700" }}>🎁 Награда</p>
                        <p className="text-sm font-bold" style={{ color: "#FFD700" }}>{q.reward}</p>
                      </div>
                      <p className="text-xs font-bold mb-2" style={{ color: "rgba(255,200,150,0.6)" }}>Шаги задания:</p>
                      <div className="space-y-2">
                        {q.steps.map((step, si) => {
                          const done = si < Math.ceil(q.steps.length * q.progress / 100);
                          return (
                            <div key={si} className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                style={{ background: done ? q.color : "rgba(255,255,255,0.1)", color: done ? "#0D0520" : "rgba(255,200,150,0.5)" }}>
                                {done ? "✓" : si + 1}
                              </div>
                              <span className="text-sm" style={{ color: done ? "rgba(255,200,150,0.9)" : "rgba(255,200,150,0.4)" }}>{step}</span>
                            </div>
                          );
                        })}
                      </div>
                      <button className="w-full mt-4 py-3 rounded-xl font-bold text-sm block-btn" style={{ background: q.color, color: "#0D0520" }}>
                        {q.progress > 0 ? "Продолжить квест" : "Начать квест"} →
                      </button>
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* PETS */}
        {activeTab === "pets" && (
          <div className="animate-slide-up space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <img src={PETS_IMG} alt="Питомцы" className="w-14 h-14 rounded-2xl object-cover" style={{ border: "2px solid #39D353" }} />
              <div>
                <h2 className="font-spooky text-2xl" style={{ color: "#39D353" }}>Питомцы</h2>
                <p className="text-sm" style={{ color: "rgba(255,200,150,0.6)" }}>Твои верные хэллоуинские друзья!</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {pets.map((p, i) => (
                <div key={i} className="rounded-2xl p-4 game-card" style={{ background: p.owned ? `${p.color}18` : "rgba(255,255,255,0.03)", border: `2px solid ${p.owned ? p.color + "66" : "rgba(255,255,255,0.08)"}`, opacity: p.owned ? 1 : 0.7 }}>
                  <div className={`text-4xl mb-2 ${p.owned ? "animate-pet-bounce" : ""} inline-block`}>{p.emoji}</div>
                  <div className="font-bold text-sm mb-1" style={{ color: p.owned ? p.color : "rgba(255,200,150,0.4)" }}>{p.name}</div>
                  {p.owned ? (
                    <>
                      <div className="flex items-center justify-between text-xs mb-2" style={{ color: "rgba(255,200,150,0.6)" }}>
                        <span>Уровень {p.level}</span>
                        <span>{p.mood}</span>
                      </div>
                      <div className="text-xs mb-3 px-2 py-0.5 rounded-full inline-block font-bold" style={{ background: `${p.color}22`, color: p.color }}>
                        ✨ {p.ability}
                      </div>
                      <button
                        onClick={() => setFedPets(prev => ({ ...prev, [i]: true }))}
                        className="w-full py-2 rounded-xl text-xs font-bold block-btn"
                        style={{ background: fedPets[i] ? "rgba(57,211,83,0.2)" : p.color, color: fedPets[i] ? "#39D353" : "#0D0520", border: fedPets[i] ? "2px solid #39D353" : "none" }}
                      >
                        {fedPets[i] ? `✓ Накормлен ${p.food}` : `Накормить ${p.food}`}
                      </button>
                    </>
                  ) : (
                    <div className="mt-2">
                      <div className="text-xs mb-3" style={{ color: "rgba(255,200,150,0.4)" }}>Способность: {p.ability}</div>
                      <button className="w-full py-2 rounded-xl text-xs font-bold block-btn" style={{ background: "rgba(255,122,0,0.2)", color: "#FF7A00", border: "1.5px solid rgba(255,122,0,0.4)" }}>
                        🪙 Получить
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACHIEVEMENTS */}
        {activeTab === "achievements" && (
          <div className="animate-slide-up space-y-4">
            <div className="rounded-2xl p-4 text-center mb-2" style={{ background: "linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,122,0,0.1))", border: "2px solid rgba(255,215,0,0.4)" }}>
              <div className="text-5xl mb-2 animate-wiggle inline-block">🏆</div>
              <h2 className="font-spooky text-2xl mb-1" style={{ color: "#FFD700" }}>Достижения</h2>
              <div className="flex justify-center gap-4 text-sm">
                <div><span className="font-bold" style={{ color: "#FFD700" }}>{earnedAch}</span><span style={{ color: "rgba(255,200,150,0.6)" }}>/{achievements.length} получено</span></div>
                <div><span className="font-bold" style={{ color: "#FF7A00" }}>{totalPoints}</span><span style={{ color: "rgba(255,200,150,0.6)" }}> очков</span></div>
              </div>
              <div className="mt-3 h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                <div className="h-full rounded-full" style={{ width: `${(earnedAch / achievements.length) * 100}%`, background: "linear-gradient(90deg, #FFD700, #FF7A00)" }} />
              </div>
            </div>
            <div className="space-y-3">
              {achievements.map((a, i) => (
                <div key={i} className="flex items-center gap-4 rounded-2xl p-4" style={{ background: a.earned ? `${a.color}15` : "rgba(255,255,255,0.03)", border: `2px solid ${a.earned ? a.color + "55" : "rgba(255,255,255,0.07)"}`, opacity: a.earned ? 1 : 0.6 }}>
                  <div className={`text-3xl flex-shrink-0 ${a.earned ? "animate-float3" : ""}`}>{a.emoji}</div>
                  <div className="flex-1">
                    <div className="font-bold text-sm" style={{ color: a.earned ? a.color : "rgba(255,200,150,0.4)" }}>{a.title}</div>
                    <div className="text-xs" style={{ color: "rgba(255,200,150,0.5)" }}>{a.desc}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {a.earned
                      ? <div className="text-xs font-bold px-2 py-1 rounded-xl" style={{ background: `${a.color}22`, color: a.color }}>+{a.points} ⭐</div>
                      : <div className="text-xs px-2 py-1 rounded-xl" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,200,150,0.3)" }}>{a.points} ⭐</div>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Bottom rainbow bar */}
      <div className="fixed bottom-0 left-0 right-0 h-1 z-30 shine-text" style={{ background: "linear-gradient(90deg, #FF7A00, #A855F7, #39D353, #EC4899, #FF7A00)", backgroundSize: "200% auto", animation: "shine 3s linear infinite" }} />
    </div>
  );
}