import { TarotCard, Suit } from "@/types";

const majorArcana: TarotCard[] = [
  {
    id: "fool",
    name: "The Fool",
    nameZh: "愚者",
    arcana: "major",
    suit: null,
    number: 0,
    keywords: ["新的开始", "冒险", "天真", "无限可能"],
    meaning: {
      upright:
        "新的开始，踏上未知的旅程。充满希望与可能，以开放的心态面对未来。不要害怕犯错，勇敢迈出第一步。",
      reversed:
        "鲁莽行事，缺乏方向。可能过于天真或不顾后果。需要停下来重新审视自己的选择，避免盲目前行。",
    },
    description:
      "愚者是塔罗牌中的第一张牌，编号为0，代表着一切的开始和无限的可能性。牌面上，一个年轻人站在悬崖边，准备踏上未知的旅程，身旁的小狗在提醒他前方的危险。他携带的只有一个小小的行囊，象征他轻装上阵、无忧无虑的心态。",
    element: null,
  },
  {
    id: "magician",
    name: "The Magician",
    nameZh: "魔术师",
    arcana: "major",
    suit: null,
    number: 1,
    keywords: ["创造力", "技能", "意志力", "自信"],
    meaning: {
      upright:
        "拥有实现目标所需的一切资源和能力。集中意志力，善用天赋，将想法转化为行动。现在是展现自己的最佳时机。",
      reversed:
        "能力被浪费或滥用。可能缺乏信心或在欺骗他人。需要审视动机，重新连接内在的力量和潜能。",
    },
    description:
      "魔术师面前摆着圣杯、宝剑、权杖和星币，分别代表四种元素和小阿尔卡那的四个牌组。他高举魔杖指向天空，另一只手指向地面，象征「如其在上，如其在下」的连接法则。",
    element: null,
  },
  {
    id: "high-priestess",
    name: "The High Priestess",
    nameZh: "女祭司",
    arcana: "major",
    suit: null,
    number: 2,
    keywords: ["直觉", "潜意识", "神秘", "内在智慧"],
    meaning: {
      upright:
        "相信自己的直觉和内在的声音。有些事情表面看不透，需要深入探索。保持沉默和观察，等待时机成熟。",
      reversed:
        "忽视直觉，过于理性分析。隐藏的秘密可能被揭露。在关系中可能存在沟通不畅或情感压抑的问题。",
    },
    description:
      "女祭司坐在两柱之间——一黑一白，代表二元对立。她手持经卷，象征隐藏的知识和智慧。脚边的月亮代表直觉和潜意识的力量。她是神秘和内在智慧的守护者。",
    element: null,
  },
  {
    id: "empress",
    name: "The Empress",
    nameZh: "皇后",
    arcana: "major",
    suit: null,
    number: 3,
    keywords: ["丰饶", "母性", "自然", "创造力"],
    meaning: {
      upright:
        "丰盛与成长的时期。创意源源不断，适合孕育新计划。关心他人，享受生活的美好与感官体验。",
      reversed:
        "过度依赖或忽视自我需求。创意枯竭，需要回归自然充电。可能过于关注物质而忽略精神层面。",
    },
    description:
      "皇后坐在茂盛的花园中，周围是丰收的麦田和绿树。她头戴十二颗星星的王冠，代表十二星座。手中的权杖象征她对物质世界的掌控。她是大地母亲的化身，代表丰饶与创造。",
    element: null,
  },
  {
    id: "emperor",
    name: "The Emperor",
    nameZh: "皇帝",
    arcana: "major",
    suit: null,
    number: 4,
    keywords: ["权威", "秩序", "稳定", "领导力"],
    meaning: {
      upright:
        "建立秩序和结构的时候到了。运用权威和纪律来实现目标。需要果断决策和强大的领导力。",
      reversed:
        "滥用权力或过于专制。缺乏自律，结构崩塌。可能需要更灵活的管理方式，而不是一味控制。",
    },
    description:
      "皇帝坐在石制宝座上，身穿盔甲，手握权杖。背后是荒芜的山脉，象征他的坚韧和不动摇。他是秩序和权威的代表，为混沌带来结构和规则。",
    element: null,
  },
  {
    id: "hierophant",
    name: "The Hierophant",
    nameZh: "教皇",
    arcana: "major",
    suit: null,
    number: 5,
    keywords: ["传统", "信仰", "教育", "指引"],
    meaning: {
      upright:
        "寻求传统智慧和精神指引。遵守既定的规则和仪式。适合学习深造或咨询有经验的人。",
      reversed:
        "挑战传统，打破常规。可能需要独立思考而非盲目追随。对权威的质疑或信仰危机。",
    },
    description:
      "教皇坐在教堂中，两旁有两名信徒在聆听他的教诲。他身穿红袍，代表宗教权威。手中的权杖和交叉的钥匙象征天地之间的连接。他是精神导师和传统守护者。",
    element: null,
  },
  {
    id: "lovers",
    name: "The Lovers",
    nameZh: "恋人",
    arcana: "major",
    suit: null,
    number: 6,
    keywords: ["爱情", "选择", "和谐", "价值观"],
    meaning: {
      upright:
        "面临重要的选择，特别是在关系和价值观方面。真诚的沟通和心灵相通带来和谐。追随内心做出决定。",
      reversed:
        "关系出现裂痕，沟通不畅。可能做出了错误的选择或难以抉择。价值观冲突带来的内心挣扎。",
    },
    description:
      "亚当和夏娃站在伊甸园中，头顶有天使拉斐尔在祝福。背后分别是生命树和智慧树。这张牌不仅代表爱情，更代表人生中的重大选择和价值观的考验。",
    element: null,
  },
  {
    id: "chariot",
    name: "The Chariot",
    nameZh: "战车",
    arcana: "major",
    suit: null,
    number: 7,
    keywords: ["胜利", "意志力", "决心", "前进"],
    meaning: {
      upright:
        "凭借强大的意志力和决心克服困难，取得胜利。控制住对立的力量，集中精力朝着目标前进。",
      reversed:
        "失控，被外界力量左右。计划受阻，需要重新调整方向。可能是过于强势导致的失败。",
    },
    description:
      "战士驾驭着由黑白两只狮身人面兽拉动的战车。它们代表对立的力量，但战士用意志力将它们统一驾驭。战车代表通过决心和自制力获得胜利。",
    element: null,
  },
  {
    id: "strength",
    name: "Strength",
    nameZh: "力量",
    arcana: "major",
    suit: null,
    number: 8,
    keywords: ["内在力量", "勇气", "耐心", "温柔"],
    meaning: {
      upright:
        "用温柔而非暴力来征服困难。内在的力量和耐心足以战胜外在的挑战。相信自己有克服一切的勇气。",
      reversed:
        "内在力量不足，缺乏自信。容易被恐惧和焦虑支配。需要重新建立对自我的信念。",
    },
    description:
      "一位女子温柔地抚摸着雄狮的嘴。她没有被狮子的凶猛吓倒，而是用内在的力量和温柔驯服了它。这代表了真正的力量不是暴力，而是勇气、耐心和内在的平静。",
    element: null,
  },
  {
    id: "hermit",
    name: "The Hermit",
    nameZh: "隐士",
    arcana: "major",
    suit: null,
    number: 9,
    keywords: ["内省", "孤独", "智慧", "指引"],
    meaning: {
      upright:
        "暂时退隐，进行内心探索。通过独处获得更深的智慧和理解。用内在的光芒照亮前行的道路。",
      reversed:
        "过度孤立自己，变得孤僻。拒绝外界的帮助。可能需要重新融入社会，分享自己的智慧。",
    },
    description:
      "一位老人独自站在山顶，手提灯笼，照亮前路。他没有同伴，只有内心的光芒引导着他。隐士代表在喧嚣之中退隐，通过内省找到真正的智慧。",
    element: null,
  },
  {
    id: "wheel-of-fortune",
    name: "Wheel of Fortune",
    nameZh: "命运之轮",
    arcana: "major",
    suit: null,
    number: 10,
    keywords: ["命运", "转折", "循环", "机遇"],
    meaning: {
      upright:
        "命运的齿轮正在转动，重大的转变即将到来。好运降临，抓住时机顺势而上。接受变化的自然规律。",
      reversed:
        "运气不佳，遭遇挫折。变化带来的不适和不安。需要耐心等待不利局面的过去。",
    },
    description:
      "命运之轮不断旋转，四个角落有四只生物在阅读书籍，代表四种固定星座。轮子上的蛇、胡狼和狮身人面代表生命中的起伏变化。一切都在循环之中，没有什么是永恒的。",
    element: null,
  },
  {
    id: "justice",
    name: "Justice",
    nameZh: "正义",
    arcana: "major",
    suit: null,
    number: 11,
    keywords: ["公平", "真相", "责任", "因果关系"],
    meaning: {
      upright:
        "公正的裁决即将到来。你需要为过去的行为负责。诚实面对自己，做出正确的决定。",
      reversed:
        "不公平的对待，偏见的判断。逃避责任或不愿面对真相。法律纠纷可能对你不利。",
    },
    description:
      "正义女神端坐，手持天平和宝剑。天平代表对事实的权衡，宝剑代表决断力。她提醒我们，每一个行为都有其后果，公正最终会到来。",
    element: null,
  },
  {
    id: "hanged-man",
    name: "The Hanged Man",
    nameZh: "倒吊人",
    arcana: "major",
    suit: null,
    number: 12,
    keywords: ["牺牲", "换位思考", "等待", "放手"],
    meaning: {
      upright:
        "换个角度看问题，暂时的停滞是为了更深的领悟。心甘情愿的牺牲带来精神的升华。",
      reversed:
        "无谓的牺牲，固执己见不愿放手。停滞不前带来的焦虑。需要果断采取行动而非被动等待。",
    },
    description:
      "一个人倒吊在树上，表情平静。他的头上有一圈光环，代表觉悟。倒吊人并非被迫受刑，而是自愿选择这个视角来重新理解世界。有时我们需要停下来，换一个角度看待问题。",
    element: null,
  },
  {
    id: "death",
    name: "Death",
    nameZh: "死神",
    arcana: "major",
    suit: null,
    number: 13,
    keywords: ["结束", "转变", "新生", "放下"],
    meaning: {
      upright:
        "一个阶段即将结束，为新事物的到来腾出空间。放下过去，接受不可避免的改变。",
      reversed:
        "抗拒改变，停滞不前。对结束的恐惧阻碍了成长。需要面对而非逃避必要的转变。",
    },
    description:
      "死神骑着白马，手持旗帜，面前的人们以不同态度面对死亡——有的抗拒，有的接受。远处太阳正在升起，暗示死亡之后必有新生。这张牌很少指肉体死亡，更多代表转变和结束。",
    element: null,
  },
  {
    id: "temperance",
    name: "Temperance",
    nameZh: "节制",
    arcana: "major",
    suit: null,
    number: 14,
    keywords: ["平衡", "调和", "中庸", "耐心"],
    meaning: {
      upright:
        "找到平衡和适度的生活方式。融合不同的元素创造和谐。耐心等待，一切都会在合适的时机到来。",
      reversed:
        "失衡，过度或不足。可能在某方面缺乏节制。需要重新找到生活的平衡点。",
    },
    description:
      "一位天使将水从一个杯子倒入另一个杯子，象征调和与平衡。一只脚在水中，一只脚在陆地，代表物质与精神的平衡。通向远方的路暗示着在平衡中前行。",
    element: null,
  },
  {
    id: "devil",
    name: "The Devil",
    nameZh: "恶魔",
    arcana: "major",
    suit: null,
    number: 15,
    keywords: ["束缚", "欲望", "执念", "物质主义"],
    meaning: {
      upright:
        "被欲望、执念或不健康的关系束缚。意识到自己处于困境中，摆脱的钥匙在自己手中。",
      reversed:
        "挣脱束缚，克服成瘾或不健康的模式。觉醒并夺回对自己人生的掌控权。",
    },
    description:
      "恶魔下方的一男一女戴着松散的锁链，其实他们随时可以挣脱。恶魔代表了我们对物质世界、欲望和执念的依赖。最深的束缚往往来自于我们自己。",
    element: null,
  },
  {
    id: "tower",
    name: "The Tower",
    nameZh: "高塔",
    arcana: "major",
    suit: null,
    number: 16,
    keywords: ["崩塌", "剧变", "觉醒", "重建"],
    meaning: {
      upright:
        "旧有结构的突然崩塌。看似灾难，实则是必要的清理。接受改变，在废墟中重建更坚固的基础。",
      reversed:
        "勉强维持即将崩塌的局面。推迟不可避免的改变只会让情况更糟。需要勇敢面对真相。",
    },
    description:
      "闪电击中了高塔，塔顶的王冠被击落，两个人从塔上坠落。高塔代表了建立在脆弱基础上的骄傲和自负。闪电是突如其来的真相，击碎了虚幻的安全感。",
    element: null,
  },
  {
    id: "star",
    name: "The Star",
    nameZh: "星星",
    arcana: "major",
    suit: null,
    number: 17,
    keywords: ["希望", "信念", "治愈", "灵感"],
    meaning: {
      upright:
        "暴风雨后的平静和希望。重新建立信心，相信美好的未来。灵感和创造力充沛的时期。",
      reversed:
        "失去希望，感到迷茫。与内在的指引失去连接。需要重新点燃信念之光。",
    },
    description:
      "一位女子裸身跪在池边，将水注入池中和大地上。天空中有一颗巨大的星星和七颗小星，代表希望和指引。在高塔的毁灭之后，星星带来了疗愈和希望的信息。",
    element: null,
  },
  {
    id: "moon",
    name: "The Moon",
    nameZh: "月亮",
    arcana: "major",
    suit: null,
    number: 18,
    keywords: ["幻觉", "恐惧", "潜意识", "直觉"],
    meaning: {
      upright:
        "前路不明，容易产生恐惧和幻觉。深入潜意识，面对内心的阴影。相信直觉而不是表面现象。",
      reversed:
        "迷雾即将散去，真相浮出水面。恐惧和焦虑正在消退。看清事物的本来面目。",
    },
    description:
      "月夜下，两只狼在对着月亮嚎叫，一只龙虾从水中爬出。远处通往未知的路径在两塔之间。月亮代表潜意识、梦境和隐藏在表面之下的真相。",
    element: null,
  },
  {
    id: "sun",
    name: "The Sun",
    nameZh: "太阳",
    arcana: "major",
    suit: null,
    number: 19,
    keywords: ["喜悦", "成功", "活力", "光明"],
    meaning: {
      upright:
        "一切变得明朗，充满温暖和活力。成功和幸福触手可及。享受生命的美好和纯真的快乐。",
      reversed:
        "阴云暂时遮住阳光。可能缺乏热情或信心不足。需要重新点燃内心的火焰。",
    },
    description:
      "太阳高照，一个孩子骑在白马上，手持红旗，向日葵在身后盛开。整张牌充满了活力和快乐。太阳是塔罗牌中最正面的牌之一，代表光明、温暖和生命力。",
    element: null,
  },
  {
    id: "judgement",
    name: "Judgement",
    nameZh: "审判",
    arcana: "major",
    suit: null,
    number: 20,
    keywords: ["觉醒", "重生", "召唤", "清算"],
    meaning: {
      upright:
        "受到内在的召唤，需要做出重要的决定。对过去进行清算和总结。这是一个觉醒和重生的时刻。",
      reversed:
        "逃避内心的召唤，害怕改变。无法从过去的经历中解脱。需要直面未完成的事情。",
    },
    description:
      "天使加百列吹响号角，坟墓中的人们纷纷醒来，回应召唤。远处是高耸的雪山。审判牌代表最终的清算和觉醒——听从内心深处的声音，迎接精神的重生。",
    element: null,
  },
  {
    id: "world",
    name: "The World",
    nameZh: "世界",
    arcana: "major",
    suit: null,
    number: 21,
    keywords: ["完成", "达成", "圆满", "整合"],
    meaning: {
      upright:
        "一个周期的圆满结束。达成了重要的目标，感到完整和满足。准备好迎接新的阶段。",
      reversed:
        "即将完成但尚未到达终点。有点不完整的感觉。需要最后一步的努力来完成循环。",
    },
    description:
      "一位舞者在月桂花环中舞蹈，周围环绕着四只生物，代表四固定星座和四元素。世界牌是愚者旅程的终点，代表完成、整合和生命的圆满。",
    element: null,
  },
];

const minorArcana: TarotCard[] = [
  // Wands (权杖) — Fire element
  ...([
    ["ace", "Ace", "一", "新的灵感，创造的火花。充满热情地开始新的冒险或项目。"],
    ["two", "Two", "二", "规划未来，考虑不同的方向。拥有力量但尚未做出最终决定。"],
    ["three", "Three", "三", "计划和准备得到了回报。事业取得进展，开始看到成果。"],
    ["four", "Four", "四", "庆祝和稳定。辛勤工作之后享受成果，建立稳固的基础。"],
    ["five", "Five", "五", "竞争和冲突。面临挑战，需要坚持自己的立场和信念。"],
    ["six", "Six", "六", "胜利和认可。获得公众的赞许，成功地完成了目标。"],
    ["seven", "Seven", "七", "坚持立场，保卫自己的信仰。面临多方面的挑战但绝不退缩。"],
    ["eight", "Eight", "八", "快速的行动和消息。事情开始加速发展，需要果断把握机会。"],
    ["nine", "Nine", "九", "最后的坚持，接近极限。尽管疲惫但必须继续坚持，胜利在望。"],
    ["ten", "Ten", "十", "负担过重，责任压身。需要学会委派和释放不必要的压力。"],
    ["page", "Page", "侍从", "充满热情的新信息或新项目。探索创造力，迎接新的可能性。"],
    ["knight", "Knight", "骑士", "热情的行动，充满冒险精神。追逐梦想，勇敢踏上新的旅程。"],
    ["queen", "Queen", "皇后", "自信和魅力的女性形象。善于领导他人，将创意转化为成果。"],
    ["king", "King", "国王", "有远见的领导者。以创造力和热情激励他人，推动伟大的事业。"],
  ] as const).map(
    ([key, name, num, meaning], i): TarotCard => ({
      id: `wand-${key}`,
      name: `${name} of Wands`,
      nameZh: `权杖${num}`,
      arcana: "minor",
      suit: "wands",
      number: i + 1,
      keywords:
        key === "ace"
          ? ["灵感", "新开始", "潜能"]
          : key === "two"
          ? ["规划", "选择", "未来"]
          : key === "three"
          ? ["远见", "扩张", "进展"]
          : key === "four"
          ? ["庆祝", "和谐", "稳定"]
          : key === "five"
          ? ["竞争", "冲突", "挑战"]
          : key === "six"
          ? ["胜利", "认可", "荣耀"]
          : key === "seven"
          ? ["坚持", "防御", "勇气"]
          : key === "eight"
          ? ["速度", "行动", "消息"]
          : key === "nine"
          ? ["韧性", "坚持", "毅力"]
          : key === "ten"
          ? ["负担", "压力", "责任"]
          : key === "page"
          ? ["探索", "新消息", "热情"]
          : key === "knight"
          ? ["冒险", "行动", "追逐"]
          : key === "queen"
          ? ["自信", "魅力", "领导"]
          : ["远见", "领导力", "激励"],
      meaning: {
        upright: meaning,
        reversed:
          key === "ace"
            ? "创意受挫，缺乏灵感或方向。可能需要等待更好的时机开启新事物。"
            : key === "two"
            ? "选择困难，对未来感到迷茫。可能因为恐惧而不敢迈出第一步。"
            : key === "three"
            ? "计划延误，进展不如预期。需要重新评估方向和方法。"
            : key === "four"
            ? "失衡，过度自我放纵。庆祝之后需要回归日常生活的秩序。"
            : key === "five"
            ? "过度竞争导致疲惫。冲突可能无果而终，需要选择更有意义的战斗。"
            : key === "six"
            ? "期待落空，认可延迟。需要保持谦逊，胜利尚未最终确定。"
            : key === "seven"
            ? "感到不堪重负，被攻破防线。需要重新整合资源再战。"
            : key === "eight"
            ? "行动受阻，计划延误。可能需要等待更合适的时机。"
            : key === "nine"
            ? "精疲力竭，坚持到极限。需要判断是继续还是放弃。"
            : key === "ten"
            ? "过度劳累导致的崩溃。必须学会放手和寻求帮助。"
            : key === "page"
            ? "缺乏方向，热情消散。新的计划可能尚未成熟。"
            : key === "knight"
            ? "冲动鲁莽，缺乏计划。热情消退后留下未完成的事情。"
            : key === "queen"
            ? "嫉妒或不安全感作祟。可能过于关注外表而非实质。"
            : "专横的领导者，缺乏远见。可能忽视团队的需求。",
      },
      description: `权杖牌组对应火元素，代表行动、创造、灵感和激情。权杖${num}代表了权杖能量在这一阶段的表达。`,
      element: "fire",
    })
  ),

  // Cups (圣杯) — Water element
  ...([
    ["ace", "Ace", "一", "新感情的萌芽。爱的开始，情感的充盈和灵性的启示。"],
    ["two", "Two", "二", "情感的连接和承诺。两人的关系正在深入发展，建立深厚纽带。"],
    ["three", "Three", "三", "庆祝友谊和团体之乐。分享喜悦，友情带来的温暖和满足。"],
    ["four", "Four", "四", "对现状的不满和厌倦。需要重新发现生命中的美好和感恩。"],
    ["five", "Five", "五", "失落和遗憾。关注失去的而非拥有的，需要转变视角。"],
    ["six", "Six", "六", "回忆过去的美好时光。怀旧和分享，旧情复燃的可能。"],
    ["seven", "Seven", "七", "幻想和选择。面对多种可能，需要甄别真实与虚幻。"],
    ["eight", "Eight", "八", "放下和前行。离开不再滋养你的环境，寻找更高的意义。"],
    ["nine", "Nine", "九", "愿望实现，情感满足。享受当下的幸福和物质的丰盛。"],
    ["ten", "Ten", "十", "情感圆满，家庭幸福。和谐的关系带来持久的满足感。"],
    ["page", "Page", "侍从", "创意灵感的消息。一个温柔敏感的年轻人，带来爱的讯息。"],
    ["knight", "Knight", "骑士", "浪漫的追求者。带着爱的提议而来，理想主义者。"],
    ["queen", "Queen", "皇后", "情感成熟和直觉力强的女性。照顾他人，充满同情心。"],
    ["king", "King", "国王", "情感成熟和控制的男性。在情感层面拥有智慧和慈悲。"],
  ] as const).map(
    ([key, name, num, meaning], i): TarotCard => ({
      id: `cup-${key}`,
      name: `${name} of Cups`,
      nameZh: `圣杯${num}`,
      arcana: "minor",
      suit: "cups",
      number: i + 1,
      keywords:
        key === "ace"
          ? ["爱", "情感", "直觉"]
          : key === "two"
          ? ["连接", "承诺", "伙伴"]
          : key === "three"
          ? ["友谊", "庆祝", "分享"]
          : key === "four"
          ? ["倦怠", "不满", "反思"]
          : key === "five"
          ? ["失落", "遗憾", "悲伤"]
          : key === "six"
          ? ["怀旧", "回忆", "重逢"]
          : key === "seven"
          ? ["幻想", "选择", "梦想"]
          : key === "eight"
          ? ["离开", "放下", "追寻"]
          : key === "nine"
          ? ["如愿", "满足", "丰盛"]
          : key === "ten"
          ? ["圆满", "家庭", "和谐"]
          : key === "page"
          ? ["温柔", "创意", "消息"]
          : key === "knight"
          ? ["浪漫", "追求", "理想"]
          : key === "queen"
          ? ["同理心", "直觉", "关怀"]
          : ["成熟", "慈悲", "智慧"],
      meaning: {
        upright: meaning,
        reversed:
          key === "ace"
            ? "情感压抑，无法表达爱意。需要处理内在的情感障碍。"
            : key === "two"
            ? "关系失衡，沟通不畅。可能需要重新审视彼此的承诺。"
            : key === "three"
            ? "过度社交，忽略深层连接。友情可能停留在表面。"
            : key === "four"
            ? "陷入消极情绪的循环。需要主动改变而非被动等待。"
            : key === "five"
            ? "沉溺于悲伤，无法走出失落。需要关注仍然拥有的事物。"
            : key === "six"
            ? "活在过去中，无法前进。需要处理未解的旧伤。"
            : key === "seven"
            ? "无法做出选择，陷入幻想的迷雾。需要脚踏实地。"
            : key === "eight"
            ? "难以放手，对过去恋恋不舍。恐惧未知的新阶段。"
            : key === "nine"
            ? "表面满足内心空虚。可能需要寻找更深层的意义。"
            : key === "ten"
            ? "家庭矛盾破坏了和谐。关系中的裂痕需要修复。"
            : key === "page"
            ? "情感不成熟，创意受阻。好消息可能推迟到来。"
            : key === "knight"
            ? "不切实际的浪漫，承诺破裂。理想的幻灭。"
            : key === "queen"
            ? "情感过度依赖，失去自我。需要建立健康的边界。"
            : "情感操纵，无法表达真实的感受。需要学习情绪智慧。",
      },
      description: `圣杯牌组对应水元素，代表情感、关系、直觉和潜意识。圣杯${num}代表了圣杯能量在这一阶段的表达。`,
      element: "water",
    })
  ),

  // Swords (宝剑) — Air element
  ...([
    ["ace", "Ace", "一", "清晰的思维和新想法。真理的利刃切开迷雾，带来精神上的突破。"],
    ["two", "Two", "二", "两难的选择。需要权衡利弊做出艰难决定，暂时的僵局。"],
    ["three", "Three", "三", "心碎和悲伤。深刻的痛苦需要时间去治愈，接受现实。"],
    ["four", "Four", "四", "休息和恢复。精神疲惫之后需要暂停和冥想，积蓄力量。"],
    ["five", "Five", "五", "冲突和胜利。智力的较量，但胜利可能以他人的失败为代价。"],
    ["six", "Six", "六", "过渡和改变。告别过去走向未知，需要勇气和信念。"],
    ["seven", "Seven", "七", "计谋和谨慎。需要策略性地处理问题，避免正面冲突。"],
    ["eight", "Eight", "八", "受限和困惑。思维被困住无法行动，需要打破自我设限。"],
    ["nine", "Nine", "九", "噩梦和焦虑。内心的恐惧被放大，影响睡眠和心理健康。"],
    ["ten", "Ten", "十", "最终的结束，彻底终结。痛苦的终点也是新的起点。"],
    ["page", "Page", "侍从", "好奇心和求知欲。新信息的到来，需要保持警觉和智慧。"],
    ["knight", "Knight", "骑士", "迅速的行动和决断。头脑敏锐，勇往直前实现目标。"],
    ["queen", "Queen", "皇后", "清晰的判断力和独立性。在理智和情感之间找到平衡。"],
    ["king", "King", "国王", "理性的权威。以智慧和经验做出公正的判断和决策。"],
  ] as const).map(
    ([key, name, num, meaning], i): TarotCard => ({
      id: `sword-${key}`,
      name: `${name} of Swords`,
      nameZh: `宝剑${num}`,
      arcana: "minor",
      suit: "swords",
      number: i + 1,
      keywords:
        key === "ace"
          ? ["真理", "清晰", "突破"]
          : key === "two"
          ? ["抉择", "僵局", "权衡"]
          : key === "three"
          ? ["悲伤", "心碎", "痛苦"]
          : key === "four"
          ? ["休息", "恢复", "冥想"]
          : key === "five"
          ? ["胜利", "冲突", "胜负"]
          : key === "six"
          ? ["过渡", "改变", "前行"]
          : key === "seven"
          ? ["策略", "谨慎", "计谋"]
          : key === "eight"
          ? ["受限", "困惑", "束缚"]
          : key === "nine"
          ? ["焦虑", "噩梦", "恐惧"]
          : key === "ten"
          ? ["终结", "结束", "释放"]
          : key === "page"
          ? ["好奇", "警觉", "消息"]
          : key === "knight"
          ? ["果断", "迅速", "锐利"]
          : key === "queen"
          ? ["明晰", "独立", "平衡"]
          : ["理性", "权威", "公正"],
      meaning: {
        upright: meaning,
        reversed:
          key === "ace"
            ? "思维混乱，真相被扭曲。需要重新寻找清晰的思路。"
            : key === "two"
            ? "无法做出决定，被选择所困。需要更多信息或直觉引导。"
            : key === "three"
            ? "无法释怀的伤痛，过度沉溺于悲伤。需要主动寻求治愈。"
            : key === "four"
            ? "休息不足导致的崩溃。需要真正给自己时间和空间恢复。"
            : key === "five"
            ? "过度侵略性导致反噬。赢得战斗但失去关系。"
            : key === "six"
            ? "拒绝改变，停留在舒适区。前行的道路被自己堵塞。"
            : key === "seven"
            ? "计谋败露，策略失误。需要更诚实直接的方式。"
            : key === "eight"
            ? "思维被解放，限制逐渐消失。挑战原有的信念系统。"
            : key === "nine"
            ? "焦虑达到顶点，但摆脱的曙光即将出现。需要寻求帮助。"
            : key === "ten"
            ? "无法放手，延长痛苦。需要接受结束并从中学习。"
            : key === "page"
            ? "八卦或不准确的消息。需要谨慎核实信息来源。"
            : key === "knight"
            ? "冲动鲁莽，不考虑后果。头脑过热需要冷静。"
            : key === "queen"
            ? "过于理性缺乏同理心。需要平衡理智与情感。"
            : "滥用智力优势，操控他人。需要重新审视自己的道德底线。",
      },
      description: `宝剑牌组对应风元素，代表思想、沟通、真理和挑战。宝剑${num}代表了宝剑能量在这一阶段的表达。`,
      element: "air",
    })
  ),

  // Pentacles (星币) — Earth element
  ...([
    ["ace", "Ace", "一", "物质的新开始。财务机会、新的投资或事业的起点。"],
    ["two", "Two", "二", "处理多重事务，保持平衡。需要灵活应对生活的各个方面。"],
    ["three", "Three", "三", "团队合作获得成功。技能得到认可，事业稳步上升。"],
    ["four", "Four", "四", "守财和控制。害怕失去已有的物质资源，需要学会分享。"],
    ["five", "Five", "五", "物质匮乏和精神贫瘠。感到被排斥或陷入困境，需要寻求帮助。"],
    ["six", "Six", "六", "慷慨和分享。给予和接受的平衡，物质和精神的双向流动。"],
    ["seven", "Seven", "七", "耐心等待成果。投资需要时间才能看到回报，不要心急。"],
    ["eight", "Eight", "八", "勤勤恳恳地工作。专注于技能的磨练，重复劳动中的工匠精神。"],
    ["nine", "Nine", "九", "物质的独立和享受。自己努力的成果带来丰盛和满足。"],
    ["ten", "Ten", "十", "家族的财富和传承。长久的繁荣和稳定的物质基础。"],
    ["page", "Page", "侍从", "学习和积累的好时机。对新技能或知识的追求带来未来回报。"],
    ["knight", "Knight", "骑士", "可靠和勤奋的行动者。脚踏实地完成每一项任务。"],
    ["queen", "Queen", "皇后", "对物质世界的细致管理。实际而慷慨，营造温暖的环境。"],
    ["king", "King", "国王", "财富和物质的掌控者。稳健务实，精于管理和投资。"],
  ] as const).map(
    ([key, name, num, meaning], i): TarotCard => ({
      id: `pentacle-${key}`,
      name: `${name} of Pentacles`,
      nameZh: `星币${num}`,
      arcana: "minor",
      suit: "pentacles",
      number: i + 1,
      keywords:
        key === "ace"
          ? ["机会", "繁荣", "新的开始"]
          : key === "two"
          ? ["平衡", "适应", "多任务"]
          : key === "three"
          ? ["团队", "合作", "技艺"]
          : key === "four"
          ? ["守财", "控制", "安全"]
          : key === "five"
          ? ["贫瘠", "困境", "被排斥"]
          : key === "six"
          ? ["分享", "慷慨", "收获"]
          : key === "seven"
          ? ["耐心", "等待", "评估"]
          : key === "eight"
          ? ["勤奋", "磨练", "专注"]
          : key === "nine"
          ? ["富足", "独立", "成果"]
          : key === "ten"
          ? ["传承", "繁荣", "家族"]
          : key === "page"
          ? ["学习", "积累", "实践"]
          : key === "knight"
          ? ["可靠", "务实", "坚持"]
          : key === "queen"
          ? ["细致", "温暖", "实际"]
          : ["富有", "稳健", "精明"],
      meaning: {
        upright: meaning,
        reversed:
          key === "ace"
            ? "错失良机，财务计划延迟。需要重新审视资源分配。"
            : key === "two"
            ? "失衡导致混乱。无法同时照顾所有事情，需要优先排序。"
            : key === "three"
            ? "团队合作的困难，各自为战。项目质量达不到预期。"
            : key === "four"
            ? "过度吝啬，对失去的恐惧。需要理解安全感来自内心而非物质。"
            : key === "five"
            ? "走出困境的曙光。学会求助，重新找到内在的富足。"
            : key === "six"
            ? "接受施舍但失去尊严。或者过度施舍导致自身匮乏。"
            : key === "seven"
            ? "对进展不满，急于求成。可能因为焦虑而放弃长期投资。"
            : key === "eight"
            ? "单调工作中的疲惫。需要找到工作的意义和乐趣。"
            : key === "nine"
            ? "物质充足但精神空虚。过度关注物质表面。"
            : key === "ten"
            ? "家族纠纷影响财富稳定。遗产或继承问题存在变数。"
            : key === "page"
            ? "学习进度缓慢，缺乏专注。需要更实际的目标和计划。"
            : key === "knight"
            ? "过于保守和停滞。缺乏动力和进取心。"
            : key === "queen"
            ? "过分关注物质环境，忽略情感层面。可能过于实际而缺乏温情。"
            : "对财富的贪婪和滥用。财务上的冒险可能带来损失。",
      },
      description: `星币牌组对应土元素，代表物质、财富、工作和实际层面。星币${num}代表了星币能量在这一阶段的表达。`,
      element: "earth",
    })
  ),
];

export const allCards: TarotCard[] = [...majorArcana, ...minorArcana];

export function getCardById(id: string): TarotCard | undefined {
  return allCards.find((c) => c.id === id);
}

export function getCardsByArcana(arcana: "major" | "minor"): TarotCard[] {
  return allCards.filter((c) => c.arcana === arcana);
}

export function getCardsBySuit(suit: Suit): TarotCard[] {
  return allCards.filter((c) => c.suit === suit);
}
