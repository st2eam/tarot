#!/usr/bin/env python3
"""
塔罗牌 AI 图片生成脚本
使用火山引擎 Seedream API (doubao-seedream-5-0-260128) 生成所有 78 张塔罗牌图片

用法:
  python scripts/generate-card-images.py --list-styles
  python scripts/generate-card-images.py --style watercolor
  python scripts/generate-card-images.py --style classical --cards major
  python scripts/generate-card-images.py --style dark_fantasy --cards wands,cups
  python scripts/generate-card-images.py --style art_nouveau --cards fool,magician,moon
  python scripts/generate-card-images.py --style oil_painting --skip-existing
  python scripts/generate-card-images.py --style classical --format png  # 输出 PNG 格式

环境变量:
  ARK_API_KEY   火山引擎方舟 API Key (必须)

图片尺寸说明 (Seedream 5.0 lite):
  塔罗牌竖版推荐: 1600x2848 (9:16, 2K)  ← 默认
  方形:           2048x2048 (1:1, 2K)
  宽版:           2848x1600 (16:9, 2K)
  最小总像素:     3686400 (约 1920x1920)
"""

from __future__ import annotations

import argparse
import os
import sys
import time
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from threading import Lock
from typing import Callable, Optional

# ──────────────────────────────────────────────────────────────────
# 依赖检测
# ──────────────────────────────────────────────────────────────────

try:
    from rich.console import Console
    from rich.panel import Panel
    from rich.table import Table
    from rich.progress import (
        Progress, SpinnerColumn, BarColumn, TextColumn,
        TimeElapsedColumn, TimeRemainingColumn, MofNCompleteColumn,
    )
    from rich.text import Text
    from rich.live import Live
    from rich.layout import Layout
    from rich import box
    HAS_RICH = True
    console = Console()
except ImportError:
    HAS_RICH = False
    console = None  # type: ignore

try:
    from volcenginesdkarkruntime import Ark
    HAS_VOLCENGINE_SDK = True
except ImportError:
    HAS_VOLCENGINE_SDK = False

try:
    import requests
    HAS_REQUESTS = True
except ImportError:
    HAS_REQUESTS = False


# ──────────────────────────────────────────────────────────────────
# 输出工具
# ──────────────────────────────────────────────────────────────────

def info(msg: str) -> None:
    if HAS_RICH:
        console.print(f"[cyan]ℹ[/cyan]  {msg}")
    else:
        print(f"[INFO] {msg}")

def success(msg: str) -> None:
    if HAS_RICH:
        console.print(f"[green]✓[/green]  {msg}")
    else:
        print(f"[OK]   {msg}")

def warn(msg: str) -> None:
    if HAS_RICH:
        console.print(f"[yellow]⚠[/yellow]  {msg}")
    else:
        print(f"[WARN] {msg}")

def error(msg: str) -> None:
    if HAS_RICH:
        console.print(f"[red]✗[/red]  {msg}")
    else:
        print(f"[ERR]  {msg}")


# ──────────────────────────────────────────────────────────────────
# 风格定义
# ──────────────────────────────────────────────────────────────────

STYLES: dict[str, dict] = {
    "classical": {
        "name": "古典插画",
        "desc": "传统塔罗牌插画风格，参考 Rider-Waite-Smith 牌组，金色与宝石色调",
        "suffix": (
            "classic tarot illustration in the Rider-Waite-Smith style, "
            "detailed linework, rich jewel tones and gold leaf, mystical symbolism, "
            "highly detailed, professional tarot artwork, full bleed illustration"
        ),
    },
    "watercolor": {
        "name": "水彩画",
        "desc": "柔和水彩风格，色彩渐变丰富，富有梦幻感",
        "suffix": (
            "beautiful watercolor painting style, soft dreamy brushstrokes, "
            "flowing ethereal colors, delicate washes and bleeding edges, "
            "pastel and jewel tones, painterly tarot card, translucent layers"
        ),
    },
    "art_nouveau": {
        "name": "新艺术运动",
        "desc": "穆夏 (Mucha) 风格的装饰性插画，精美花卉装饰",
        "suffix": (
            "Art Nouveau style inspired by Alphonse Mucha, "
            "elegant sinuous lines, gold accents, ornamental floral design, belle époque aesthetic, "
            "intricate patterns, sophisticated and graceful, highly detailed full bleed illustration"
        ),
    },
    "dark_fantasy": {
        "name": "暗黑奇幻",
        "desc": "神秘暗黑风格，强烈明暗对比，充满张力",
        "suffix": (
            "dark fantasy art style, dramatic chiaroscuro lighting, deep shadows, "
            "moody gothic atmosphere, rich dark colors with glowing accents, "
            "intricate mystical details, dramatic and powerful, oil paint texture"
        ),
    },
    "minimalist": {
        "name": "极简主义",
        "desc": "简洁几何线条，现代设计感，留白大气",
        "suffix": (
            "minimalist flat design illustration, clean geometric shapes, "
            "bold clean lines, limited earthy color palette, modern tarot aesthetic, "
            "generous negative space, Bauhaus inspired, elegant simplicity"
        ),
    },
    "oil_painting": {
        "name": "古典油画",
        "desc": "文艺复兴风格古典油画，厚重质感，光影绝美",
        "suffix": (
            "classical oil painting style, Renaissance technique, rich impasto texture, "
            "dramatic Rembrandt lighting, museum quality fine art, "
            "deep luminous colors, old master technique, exquisite detail"
        ),
    },
    "japanese": {
        "name": "日式浮世绘",
        "desc": "日本传统版画风格，大胆轮廓，装饰图案优美",
        "suffix": (
            "Japanese ukiyo-e woodblock print style, bold black outlines, "
            "flat areas of color with subtle gradients, traditional Japanese patterns, "
            "Edo period aesthetic, influenced by Hokusai and Hiroshige, decorative waves and flora"
        ),
    },
    "cyberpunk": {
        "name": "赛博朋克",
        "desc": "霓虹科技与神秘主义融合，未来感十足",
        "suffix": (
            "cyberpunk aesthetic tarot, neon holographic colors, futuristic technology elements, "
            "glitch art effects, dark background with vibrant neon glows, "
            "digital mysticism, sci-fi tarot card, ultraviolet and electric blue tones"
        ),
    },
    "stained_glass": {
        "name": "彩色玻璃",
        "desc": "教堂彩窗风格，色彩斑斓，神圣感强烈",
        "suffix": (
            "stained glass window artwork style, bold black leading lines, "
            "vibrant translucent jewel-tone colors, Gothic cathedral aesthetic, "
            "geometric and organic shapes, luminous backlit appearance, sacred and divine atmosphere"
        ),
    },
    "sketch": {
        "name": "手绘素描",
        "desc": "铅笔手绘风格，粗犷线条，原始草稿感",
        "suffix": (
            "hand-drawn pencil sketch illustration, expressive gestural linework, "
            "fine hatching and cross-hatching for shading, rough textured paper appearance, "
            "monochromatic graphite tones with subtle sepia wash, loose and organic strokes, "
            "sketchbook aesthetic, visible pencil texture, artist's original drawing feel"
        ),
    },
}

# ──────────────────────────────────────────────────────────────────
# 78 张塔罗牌提示词
# ──────────────────────────────────────────────────────────────────

CARD_META: dict[str, dict] = {
    # ── 大阿尔卡那 (Major Arcana) ──────────────────────────────────
    "fool": {
        "nameZh": "愚者",
        "prompt": (
            "The Fool tarot card: a carefree young traveler in colorful motley clothes stepping "
            "joyfully off a cliff edge, a small white dog barking at his heels, carrying a white "
            "rose and a bindle staff, mountains and bright sun in background, looking upward with "
            "innocent wonder, number 0"
        ),
    },
    "magician": {
        "nameZh": "魔术师",
        "prompt": (
            "The Magician tarot card: a robed figure at a ritual table displaying all four tarot "
            "suit objects — cup, sword, wand, and pentacle — one hand raises a wand toward heaven, "
            "other hand points to earth, infinity lemniscate above his head, roses and lilies border, "
            "red robes and white undergarment, number 1"
        ),
    },
    "high-priestess": {
        "nameZh": "女祭司",
        "prompt": (
            "The High Priestess tarot card: a serene veiled priestess seated between a black pillar "
            "and a white pillar, holding an open scroll labeled TORA, crescent moon at her feet, "
            "a triple crown, pomegranate tapestry curtain behind her, calm and mysterious, number 2"
        ),
    },
    "empress": {
        "nameZh": "皇后",
        "prompt": (
            "The Empress tarot card: a beautiful crowned empress reclining on a lush throne amid "
            "golden wheat and lush forest, twelve-star crown, a heart-shaped shield with Venus symbol, "
            "flowing robes with pomegranate pattern, a waterfall, abundant nature all around, number 3"
        ),
    },
    "emperor": {
        "nameZh": "皇帝",
        "prompt": (
            "The Emperor tarot card: a stern bearded emperor enthroned on a stone seat carved with "
            "four ram heads, wearing red robes over silver armor, holding an ankh scepter and orb, "
            "barren red mountains behind him, radiating authority, number 4"
        ),
    },
    "hierophant": {
        "nameZh": "教皇",
        "prompt": (
            "The Hierophant tarot card: a solemn pope-like figure in ornate papal vestments seated "
            "on a throne between two carved pillars, right hand raised in benediction with two fingers, "
            "left hand holding a triple cross scepter, two monks kneeling in devotion, crossed keys at feet, number 5"
        ),
    },
    "lovers": {
        "nameZh": "恋人",
        "prompt": (
            "The Lovers tarot card: two robed figures standing beneath a radiant angelic being with "
            "great wings descending from golden clouds, surrounded by the Garden of Eden, lush trees "
            "and flowers, a serpent coiled around a fruit tree, bright blazing sun overhead, "
            "symbolic union and divine blessing, mystical atmosphere, number 6"
        ),
    },
    "chariot": {
        "nameZh": "战车",
        "prompt": (
            "The Chariot tarot card: a triumphant armored warrior riding a canopied chariot pulled by "
            "two sphinxes — one black and one white — holding a wand scepter, crescent moon pauldrons, "
            "walled city in background, star-covered canopy, commanding presence, number 7"
        ),
    },
    "strength": {
        "nameZh": "力量",
        "prompt": (
            "The Strength tarot card: a gentle serene woman in white robes with a floral crown and garland, "
            "calmly and lovingly closing the jaws of a great lion with her bare hands, "
            "infinity symbol floating above her head, green landscape, mountains beyond, number 8"
        ),
    },
    "hermit": {
        "nameZh": "隐者",
        "prompt": (
            "The Hermit tarot card: a solitary ancient robed hermit standing alone on a snowy mountain peak, "
            "raising a lantern that contains a glowing six-pointed star to light the way, "
            "leaning on a long staff, long white beard, deep in contemplation, grey sky, number 9"
        ),
    },
    "wheel-of-fortune": {
        "nameZh": "命运之轮",
        "prompt": (
            "The Wheel of Fortune tarot card: a large golden wheel in the clouds with Hebrew letters and "
            "alchemical symbols, a sphinx atop the wheel, a serpent descending one side, Anubis ascending "
            "the other, four winged creatures in the corners of the card reading books — angel, eagle, lion, bull, number 10"
        ),
    },
    "justice": {
        "nameZh": "正义",
        "prompt": (
            "The Justice tarot card: a crowned figure in red robes seated on a stone throne, holding an "
            "upright double-edged sword in the raised right hand, balanced scales in the left hand, "
            "between two grey pillars, a purple veil behind, stern and impartial, number 11"
        ),
    },
    "hanged-man": {
        "nameZh": "倒吊人",
        "prompt": (
            "The Hanged Man tarot card: a young man suspended upside-down by his right foot from a "
            "living T-shaped wooden cross, left leg bent forming a cross shape, arms behind his back, "
            "golden halo radiating around his head, serene peaceful expression, number 12"
        ),
    },
    "death": {
        "nameZh": "死神",
        "prompt": (
            "The Death tarot card: an armored skeleton on a white horse carrying a black banner with a "
            "white rose, riding past fallen figures of all social classes — a king, a bishop, a maiden, "
            "a child — two towers on the horizon with the sun setting between them, number 13"
        ),
    },
    "temperance": {
        "nameZh": "节制",
        "prompt": (
            "The Temperance tarot card: a tall winged androgynous angel with a radiant solar crown in "
            "the background, one foot on land and one in water, pouring liquid between two golden cups "
            "in a continuous stream, white robes with a triangle-in-square symbol on the chest, irises growing nearby, number 14"
        ),
    },
    "devil": {
        "nameZh": "恶魔",
        "prompt": (
            "The Devil tarot card: a dark goat-headed devil figure seated on a black altar-throne, "
            "bat wings spread, an inverted pentagram above, a naked man and woman chained loosely at the base, "
            "horns, cloven hooves, a lit torch, oppressive and dark atmosphere, number 15"
        ),
    },
    "tower": {
        "nameZh": "塔",
        "prompt": (
            "The Tower tarot card: a tall dark stone tower on a rocky crag struck by a lightning bolt "
            "from a stormy sky, the gilded crown blown off the top, two figures tumbling headfirst from "
            "the blazing windows, flames and debris, twenty-two yod symbols falling like rain, number 16"
        ),
    },
    "star": {
        "nameZh": "星星",
        "prompt": (
            "The Star tarot card: a gracefully robed figure kneeling peacefully at the edge of a "
            "shimmering celestial pool under a vast star-filled night sky, pouring water from two "
            "golden pitchers — one into the pool, one onto the land — a great radiant eight-pointed "
            "star blazing above, seven smaller stars scattered across the sky, "
            "an ibis perched in a distant tree, serene and hopeful, number 17"
        ),
    },
    "moon": {
        "nameZh": "月亮",
        "prompt": (
            "The Moon tarot card: a full moon with a human face shining eerie light over a mysterious "
            "twilight landscape, a crayfish emerging from a dark pool, a wolf and a dog howling at the "
            "moon on either side of a winding path, two tall towers in the distant moonlit hills, number 18"
        ),
    },
    "sun": {
        "nameZh": "太阳",
        "prompt": (
            "The Sun tarot card: a radiant blazing sun with a cheerful human face shining gloriously "
            "in a blue sky, a naked young child riding a white horse joyfully, waving a large red banner, "
            "tall sunflowers growing behind a garden wall, exuberant happiness, number 19"
        ),
    },
    "judgement": {
        "nameZh": "审判",
        "prompt": (
            "The Judgement tarot card: a magnificent winged angel blowing a great trumpet from golden "
            "clouds, below are grey naked figures — men, women and children — rising from open coffins "
            "with arms outstretched in awe, icy mountains and sea in the background, divine awakening, number 20"
        ),
    },
    "world": {
        "nameZh": "世界",
        "prompt": (
            "The World tarot card: a joyful naked figure draped in a purple sash dancing inside a "
            "large wreath of laurel, holding a wand in each hand, four living creatures in the corners "
            "of the card — an angel, an eagle, a lion, and a bull — completion and wholeness, number 21"
        ),
    },
    # ── 权杖 Wands ────────────────────────────────────────────────
    "wand-ace": {
        "nameZh": "权杖一",
        "prompt": (
            "Ace of Wands tarot card: a divine hand emerging from golden clouds grasping a living "
            "wooden wand with fresh green leaves sprouting from it, a verdant landscape with castle "
            "on a hill below, representing pure creative fire and new beginnings"
        ),
    },
    "wand-two": {
        "nameZh": "权杖二",
        "prompt": (
            "Two of Wands tarot card: a wealthy nobleman in red cloak standing on a castle parapet "
            "between two tall wands, holding a small globe in one hand, gazing out at a vast sea "
            "with ships, mountains behind, contemplating expansion and future ventures"
        ),
    },
    "wand-three": {
        "nameZh": "权杖三",
        "prompt": (
            "Three of Wands tarot card: a robed figure standing on a cliff edge overlooking a wide "
            "sea with ships sailing below, leaning on one wand, two more planted behind, orange and "
            "red robes, looking confidently into the distance toward realized plans"
        ),
    },
    "wand-four": {
        "nameZh": "权杖四",
        "prompt": (
            "Four of Wands tarot card: four tall wands planted in a garden with a garland of flowers "
            "and fruit strung between them forming a canopy, two joyful figures in the foreground "
            "celebrating with bouquets, a magnificent castle in the background, harvest festival"
        ),
    },
    "wand-five": {
        "nameZh": "权杖五",
        "prompt": (
            "Five of Wands tarot card: five young men in colorful clothes engaged in a vigorous "
            "competitive struggle with wooden staves, each wearing different clothes, chaotic energy, "
            "blue sky behind, representing competition, conflict and striving"
        ),
    },
    "wand-six": {
        "nameZh": "权杖六",
        "prompt": (
            "Six of Wands tarot card: a triumphant warrior in red cloak riding a white horse through "
            "a cheering crowd, wearing a laurel wreath crown, carrying a tall wand adorned with a "
            "victory wreath, people celebrating around him, public acclaim and success"
        ),
    },
    "wand-seven": {
        "nameZh": "权杖七",
        "prompt": (
            "Seven of Wands tarot card: a determined young man in green tunic standing on higher "
            "ground, fiercely wielding a wand to defend against six wands thrusting up from below, "
            "mismatched shoes, standing firm, defending his advantageous position"
        ),
    },
    "wand-eight": {
        "nameZh": "权杖八",
        "prompt": (
            "Eight of Wands tarot card: eight flowering wooden wands flying through a clear open sky "
            "in a parallel formation, streaking toward the ground, a beautiful green river valley "
            "and rolling hills far below, swift unstoppable momentum"
        ),
    },
    "wand-nine": {
        "nameZh": "权杖九",
        "prompt": (
            "Nine of Wands tarot card: a weary battle-worn man with a bandaged head gripping a "
            "tall wand defensively, looking back over his shoulder with wariness, eight more wands "
            "standing behind him like a palisade fence, last stand and resilience"
        ),
    },
    "wand-ten": {
        "nameZh": "权杖十",
        "prompt": (
            "Ten of Wands tarot card: a hunched figure burdened by carrying ten heavy wands bundled "
            "together, struggling with difficulty along a path toward a village nearby, completely "
            "obscuring their face, representing oppressive burdens and overcommitment"
        ),
    },
    "wand-page": {
        "nameZh": "权杖侍从",
        "prompt": (
            "Page of Wands tarot card: a young adventurous page in a tunic decorated with salamander "
            "patterns, standing in an arid sandy landscape with pyramids, holding a tall flowering "
            "wand upright with both hands, gazing at it with excited curiosity"
        ),
    },
    "wand-knight": {
        "nameZh": "权杖骑士",
        "prompt": (
            "Knight of Wands tarot card: a bold knight in yellow armor adorned with salamander motifs "
            "riding a spirited rearing horse through a desert with pyramids, brandishing a wand high "
            "in the air, flames and passion, charging forward with reckless confidence"
        ),
    },
    "wand-queen": {
        "nameZh": "权杖皇后",
        "prompt": (
            "Queen of Wands tarot card: a self-assured sunlit queen on a sunflower-carved golden "
            "throne, holding a long wand in one hand and a sunflower in the other, a sleek black cat "
            "sitting at her feet, lion heads on throne, desert in background, magnetic charisma"
        ),
    },
    "wand-king": {
        "nameZh": "权杖国王",
        "prompt": (
            "King of Wands tarot card: a powerful mature king on a lion-decorated throne, wearing "
            "robes covered in salamander patterns, holding a blossoming wand, a small salamander at "
            "the base of the throne, fiery and visionary energy, leadership and inspiration"
        ),
    },
    # ── 圣杯 Cups ──────────────────────────────────────────────────
    "cup-ace": {
        "nameZh": "圣杯一",
        "prompt": (
            "Ace of Cups tarot card: a divine hand emerging from luminous clouds offering an ornate "
            "golden chalice overflowing with five streams of pure water, a white dove descending "
            "carrying a communion wafer, lotus blossoms on a shimmering pool below, spiritual love"
        ),
    },
    "cup-two": {
        "nameZh": "圣杯二",
        "prompt": (
            "Two of Cups tarot card: a young man and woman facing each other in elegant garments, "
            "exchanging golden cups in a formal pledge, a winged caduceus of Hermes with a lion head "
            "floating between them, garland of roses, tender emotional bond and partnership"
        ),
    },
    "cup-three": {
        "nameZh": "圣杯三",
        "prompt": (
            "Three of Cups tarot card: three graceful young women dancing together in a lush autumn "
            "garden overflowing with fruit and flowers, each joyfully raising a golden cup in a toast, "
            "celebration of friendship, abundance and community"
        ),
    },
    "cup-four": {
        "nameZh": "圣杯四",
        "prompt": (
            "Four of Cups tarot card: a young man sitting cross-legged under a large tree, arms "
            "folded, staring with dissatisfaction at three cups on the grass before him, a mysterious "
            "hand extending from a cloud offering a fourth cup which he ignores, introspection and ennui"
        ),
    },
    "cup-five": {
        "nameZh": "圣杯五",
        "prompt": (
            "Five of Cups tarot card: a mournful figure in a long black cloak standing with bowed "
            "head over three spilled cups, a pool of liquid on the ground, two upright full cups "
            "behind, a bridge and castle in the misty distance, loss and regret"
        ),
    },
    "cup-six": {
        "nameZh": "圣杯六",
        "prompt": (
            "Six of Cups tarot card: a sweet scene in an old-fashioned village garden, a young boy "
            "offering a white cup filled with flowers to a smaller girl, another figure walking away "
            "in the background, nostalgic golden light, innocence and happy memories"
        ),
    },
    "cup-seven": {
        "nameZh": "圣杯七",
        "prompt": (
            "Seven of Cups tarot card: a dark silhouetted figure staring up in wonder at seven "
            "golden cups floating in billowing clouds, each cup containing a different vision — "
            "a castle, jewels, a wreath, a snake, a dragon, a shrouded figure, a glowing head, illusions and fantasy"
        ),
    },
    "cup-eight": {
        "nameZh": "圣杯八",
        "prompt": (
            "Eight of Cups tarot card: a solitary cloaked figure walking away with a staff into "
            "dark barren mountains under a solar eclipse and crescent moon at night, eight golden "
            "cups carefully stacked and abandoned behind, leaving comfort to seek deeper meaning"
        ),
    },
    "cup-nine": {
        "nameZh": "圣杯九",
        "prompt": (
            "Nine of Cups tarot card: a portly satisfied man sitting on a wooden bench with arms "
            "crossed and a self-pleased smile, nine golden cups displayed proudly on a curved shelf "
            "draped in blue cloth behind him, the wish card, contentment and fulfillment"
        ),
    },
    "cup-ten": {
        "nameZh": "圣杯十",
        "prompt": (
            "Ten of Cups tarot card: a loving couple embracing with outstretched arms beneath a "
            "glorious rainbow arc of ten golden cups in the sky, two children dancing joyfully "
            "beside them, a peaceful house by a river and green hills, family bliss and emotional fulfillment"
        ),
    },
    "cup-page": {
        "nameZh": "圣杯侍从",
        "prompt": (
            "Page of Cups tarot card: a fanciful young page wearing a floral hat and fish-patterned "
            "blue tunic, standing by the calm sea, holding a golden cup from which a small fish "
            "unexpectedly pops up its head, gazing at it with delighted surprise, imagination"
        ),
    },
    "cup-knight": {
        "nameZh": "圣杯骑士",
        "prompt": (
            "Knight of Cups tarot card: a graceful knight on a calm white horse, wearing silver "
            "armor decorated with fish motifs and winged helmet and boots, holding a golden cup "
            "extended forward as an offering, a river and mountains beyond, romantic and idealistic"
        ),
    },
    "cup-queen": {
        "nameZh": "圣杯皇后",
        "prompt": (
            "Queen of Cups tarot card: a beautiful queen seated on a ornate throne decorated with "
            "water nymphs and shells at the sea's edge, holding a magnificent golden closed chalice "
            "with great reverence, gazing at it dreamily, deep blue sea and sky, intuition and empathy"
        ),
    },
    "cup-king": {
        "nameZh": "圣杯国王",
        "prompt": (
            "King of Cups tarot card: a kind-faced king seated on a stone throne that floats amid "
            "rough ocean waves, wearing blue robes and a golden crown, holding a golden cup and "
            "scepter, a fish amulet at his neck, a ship sailing past, emotional wisdom and compassion"
        ),
    },
    # ── 宝剑 Swords ────────────────────────────────────────────────
    "sword-ace": {
        "nameZh": "宝剑一",
        "prompt": (
            "Ace of Swords tarot card: a powerful hand emerging from radiant clouds gripping an "
            "upright gleaming sword, a golden crown hangs at its tip with an olive branch and palm "
            "frond, jagged mountain peaks below, clarity, truth and breakthrough power"
        ),
    },
    "sword-two": {
        "nameZh": "宝剑二",
        "prompt": (
            "Two of Swords tarot card: a blindfolded woman in white robes sitting rigidly on a "
            "stone bench, holding two large crossed swords across her chest, a calm sea and crescent "
            "moon behind her, rocky islands, suspended in difficult indecision"
        ),
    },
    "sword-three": {
        "nameZh": "宝剑三",
        "prompt": (
            "Three of Swords tarot card: a single red heart pierced through by three swords against "
            "a dark stormy sky with heavy rain clouds, stark and powerful imagery, heartbreak, "
            "grief and painful truth"
        ),
    },
    "sword-four": {
        "nameZh": "宝剑四",
        "prompt": (
            "Four of Swords tarot card: a knight's effigy lying in peaceful repose on a stone tomb "
            "in a church interior, hands in prayer, one sword beneath the figure and three swords "
            "mounted horizontally on the wall above, a stained glass window, rest and recovery"
        ),
    },
    "sword-five": {
        "nameZh": "宝剑五",
        "prompt": (
            "Five of Swords tarot card: a smirking young man gathering three swords while two "
            "defeated figures walk away in shame toward a stormy sea, two swords on the ground, "
            "dark churning sky, hollow victory at another's expense"
        ),
    },
    "sword-six": {
        "nameZh": "宝剑六",
        "prompt": (
            "Six of Swords tarot card: a ferryman poling a small wooden boat across calm water, "
            "a woman and child huddled sadly in the bow, six upright swords standing in the front "
            "of the boat, moving away from troubled waters to a calmer shore in the distance"
        ),
    },
    "sword-seven": {
        "nameZh": "宝剑七",
        "prompt": (
            "Seven of Swords tarot card: a sly figure sneaking away from a military encampment, "
            "carrying five swords in his arms and glancing back over his shoulder with a cunning "
            "grin, two swords remain stuck in the ground, colorful tents, stealth and cunning"
        ),
    },
    "sword-eight": {
        "nameZh": "宝剑八",
        "prompt": (
            "Eight of Swords tarot card: a woman blindfolded and lightly bound standing alone "
            "surrounded by eight upright swords forming a loose cage around her, marshy ground, "
            "a dark castle on a cliff in the background, perceived restriction and helplessness"
        ),
    },
    "sword-nine": {
        "nameZh": "宝剑九",
        "prompt": (
            "Nine of Swords tarot card: a person awakening in the dark night, sitting up in bed "
            "with their face buried in their hands in despair, nine horizontal swords mounted on "
            "the dark wall behind, a quilt decorated with roses and astrological symbols, nightmares"
        ),
    },
    "sword-ten": {
        "nameZh": "宝剑十",
        "prompt": (
            "Ten of Swords tarot card: a prostrate figure lying face-down on a bleak shore, ten "
            "swords thrust dramatically into their back, dark storm clouds above but a calm golden "
            "light glowing at the horizon, the definitive painful ending before a new dawn"
        ),
    },
    "sword-page": {
        "nameZh": "宝剑侍从",
        "prompt": (
            "Page of Swords tarot card: a nimble young page standing on a windy hilltop with "
            "swirling clouds and birds overhead, holding a long sword aloft with both hands "
            "and glancing sideways with alert watchful eyes, agile, quick-thinking and curious"
        ),
    },
    "sword-knight": {
        "nameZh": "宝剑骑士",
        "prompt": (
            "Knight of Swords tarot card: a fierce fully armored knight charging at full gallop "
            "on a white horse, sword raised high, birds and storm clouds racing behind, the horse's "
            "mane and the knight's plume streaming, butterfly decorations on armor, unstoppable drive"
        ),
    },
    "sword-queen": {
        "nameZh": "宝剑皇后",
        "prompt": (
            "Queen of Swords tarot card: a stern and composed queen seated on a stone throne carved "
            "with butterflies and clouds, right arm raised holding an upright sword, left hand "
            "extended palm up, strong winds bending trees behind her, a bird flies nearby, sharp intellect"
        ),
    },
    "sword-king": {
        "nameZh": "宝剑国王",
        "prompt": (
            "King of Swords tarot card: a stern authoritative king enthroned with butterfly and "
            "crescent carvings, facing slightly aside, holding an upright sword with a firm grip, "
            "windswept trees behind, clouds in a pale sky, representing law, reason and authority"
        ),
    },
    # ── 星币 Pentacles ────────────────────────────────────────────
    "pentacle-ace": {
        "nameZh": "星币一",
        "prompt": (
            "Ace of Pentacles tarot card: a divine hand emerging from luminous clouds offering a "
            "single large golden pentacle with a five-pointed star, below a beautiful garden archway "
            "of flowers leading to white mountains, abundant material potential and prosperity"
        ),
    },
    "pentacle-two": {
        "nameZh": "星币二",
        "prompt": (
            "Two of Pentacles tarot card: a young man in a tall hat dancing gracefully on the "
            "shoreline, juggling two golden pentacles connected by a green infinity ribbon, "
            "large waves with ships tossed about behind him, balance amid constant change"
        ),
    },
    "pentacle-three": {
        "nameZh": "星币三",
        "prompt": (
            "Three of Pentacles tarot card: a skilled stonemason or sculptor working on carvings "
            "high in a Gothic cathedral, consulting with a robed monk and a noble patron who holds "
            "architectural plans, three pentacles above, skilled craftsmanship and collaboration"
        ),
    },
    "pentacle-four": {
        "nameZh": "星币四",
        "prompt": (
            "Four of Pentacles tarot card: a crowned figure sitting stiffly before a distant city, "
            "clutching one pentacle tightly to their chest, one pentacle balanced on their crown, "
            "and one under each foot, possessive body language, miserly attachment to material wealth"
        ),
    },
    "pentacle-five": {
        "nameZh": "星币五",
        "prompt": (
            "Five of Pentacles tarot card: two ragged destitute figures — one on crutches — trudging "
            "through a blizzard of snow outside a church, a warm stained glass window glowing with "
            "five pentacles above them, feeling excluded and in material hardship"
        ),
    },
    "pentacle-six": {
        "nameZh": "星币六",
        "prompt": (
            "Six of Pentacles tarot card: a wealthy merchant in a red cloak holding a balanced golden "
            "scale, distributing coins generously to two kneeling beggars at his feet, pentacles "
            "surrounding him, the balance of giving and receiving, generosity and fairness"
        ),
    },
    "pentacle-seven": {
        "nameZh": "星币七",
        "prompt": (
            "Seven of Pentacles tarot card: a young farmer pausing his work to lean on his hoe "
            "and gaze thoughtfully at a lush green bush bearing seven golden pentacles, evaluating "
            "the harvest of his efforts, patience and considered investment"
        ),
    },
    "pentacle-eight": {
        "nameZh": "星币八",
        "prompt": (
            "Eight of Pentacles tarot card: a dedicated craftsman seated at a workbench, carefully "
            "engraving pentacles on coins or discs, six finished pentacles hanging on a post beside "
            "him, a town in the distance, diligent apprenticeship and skill mastery"
        ),
    },
    "pentacle-nine": {
        "nameZh": "星币九",
        "prompt": (
            "Nine of Pentacles tarot card: an elegantly dressed prosperous woman standing in a "
            "beautiful private vineyard, a hooded falcon perched on her gloved hand, nine golden "
            "pentacles among the vines, a snail at her feet, luxury through independence and self-reliance"
        ),
    },
    "pentacle-ten": {
        "nameZh": "星币十",
        "prompt": (
            "Ten of Pentacles tarot card: a wealthy white-haired patriarch seated with two loyal "
            "hounds, watching a young couple with a child in an archway leading to a great estate, "
            "ten pentacles arranged in the Kabbalistic Tree of Life pattern, ancestral wealth and legacy"
        ),
    },
    "pentacle-page": {
        "nameZh": "星币侍从",
        "prompt": (
            "Page of Pentacles tarot card: a studious young page standing in a lush flowering meadow, "
            "holding a single golden pentacle up before him with both hands, gazing at it with focused "
            "concentration, mountains and forest beyond, earnest pursuit of practical knowledge"
        ),
    },
    "pentacle-knight": {
        "nameZh": "星币骑士",
        "prompt": (
            "Knight of Pentacles tarot card: a methodical knight in black armor sitting perfectly "
            "still on a sturdy dark horse in a plowed field, carefully examining a golden pentacle "
            "in his outstretched hand, slow, reliable and thoroughly dependable"
        ),
    },
    "pentacle-queen": {
        "nameZh": "星币皇后",
        "prompt": (
            "Queen of Pentacles tarot card: a nurturing queen on a richly carved floral throne "
            "in a lush garden, gazing tenderly at a golden pentacle in her lap, roses and goats "
            "around her throne, a rabbit in the meadow, bountiful nature surrounding her, abundance"
        ),
    },
    "pentacle-king": {
        "nameZh": "星币国王",
        "prompt": (
            "King of Pentacles tarot card: a powerful and prosperous king enthroned outdoors amid "
            "a lush garden and a castle, wearing robes richly embroidered with grapes and pentacles, "
            "bull heads on the throne, holding a golden pentacle and a scepter, mastery of the material world"
        ),
    },
}

# Card groupings
MAJOR_IDS = [
    "fool", "magician", "high-priestess", "empress", "emperor", "hierophant",
    "lovers", "chariot", "strength", "hermit", "wheel-of-fortune", "justice",
    "hanged-man", "death", "temperance", "devil", "tower", "star", "moon",
    "sun", "judgement", "world",
]
WANDS_IDS = [f"wand-{n}" for n in ["ace","two","three","four","five","six","seven","eight","nine","ten","page","knight","queen","king"]]
CUPS_IDS  = [f"cup-{n}"  for n in ["ace","two","three","four","five","six","seven","eight","nine","ten","page","knight","queen","king"]]
SWORDS_IDS  = [f"sword-{n}"    for n in ["ace","two","three","four","five","six","seven","eight","nine","ten","page","knight","queen","king"]]
PENTACLES_IDS = [f"pentacle-{n}" for n in ["ace","two","three","four","five","six","seven","eight","nine","ten","page","knight","queen","king"]]
ALL_IDS = MAJOR_IDS + WANDS_IDS + CUPS_IDS + SWORDS_IDS + PENTACLES_IDS


# ──────────────────────────────────────────────────────────────────
# API 调用
# ──────────────────────────────────────────────────────────────────

MODEL = "doubao-seedream-5-0-260128"
API_BASE = "https://ark.cn-beijing.volces.com/api/v3"


def build_prompt(card_id: str, style: str) -> str:
    """
    生成【纯插画】提示词。
    边框、文字、卡片编号、牌名等固定元素由前端 CSS 渲染，
    因此 AI 只需要生成干净的插画主体，不需要任何装饰边框或文字。
    """
    meta = CARD_META[card_id]
    base = meta["prompt"]
    style_suffix = STYLES[style]["suffix"]
    return (
        f"{base}. "
        f"{style_suffix}. "
        # 关键约束：不要边框、不要文字、不要卡片框架
        "Pure illustration artwork only. "
        "NO card border, NO decorative frame, NO text, NO title, NO numbers, NO labels. "
        "The artwork fills the entire image edge-to-edge. "
        "Vertical portrait orientation 9:16, highly detailed, beautiful composition."
    )


def generate_image_stream(
    client: "Ark",
    prompt: str,
    size: str,
    fmt: str,
    status_cb: Optional[Callable[[str], None]] = None,
) -> Optional[str]:
    """
    使用 volcengine SDK 流式生成图片。
    流式模式下可实时接收事件：图像就绪时立刻获取 URL，无需等待整个响应。
    """
    extra: dict = {"watermark": False}
    # output_format 仅在明确请求 PNG 时传入（默认为 jpeg）
    if fmt == "png":
        extra["output_format"] = "png"
    stream = client.images.generate(
        model=MODEL,
        prompt=prompt,
        size=size,
        response_format="url",
        stream=True,
        extra_body=extra,
    )
    url: Optional[str] = None
    for event in stream:
        if event is None:
            continue
        if event.type == "image_generation.partial_image":
            # 低分辨率预览帧（可选展示）
            if status_cb:
                status_cb("渲染中...")
        elif event.type == "image_generation.partial_succeeded":
            # 图像完整生成完毕，获取 URL
            if event.url:
                url = event.url
                if status_cb:
                    status_cb("图像就绪，下载中...")
        elif event.type == "image_generation.partial_failed":
            code = getattr(event.error, "code", "") if event.error else ""
            msg  = getattr(event.error, "message", str(event.error))
            raise ValueError(f"生成失败 [{code}]: {msg}")
        elif event.type == "image_generation.completed":
            if status_cb:
                usage = getattr(event, "usage", None)
                if usage:
                    status_cb(f"完成 (tokens: {usage})")
    return url


def generate_image_http(
    api_key: str,
    prompt: str,
    size: str,
    fmt: str,
    status_cb: Optional[Callable[[str], None]] = None,
) -> Optional[str]:
    """直接 HTTP 调用（无 SDK 时的降级方案，不支持流式）"""
    import json as _json
    if status_cb:
        status_cb("请求中...")
    payload = _json.dumps({
        "model": MODEL,
        "prompt": prompt,
        "size": size,
        "output_format": fmt,   # jpeg / png
        "watermark": False,
        "response_format": "url",
    }).encode()
    req = urllib.request.Request(
        f"{API_BASE}/images/generations",
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=180) as resp:
        data = _json.loads(resp.read())
    if status_cb:
        status_cb("图像就绪，下载中...")
    return data["data"][0]["url"] if data.get("data") else None


def download_image(url: str, dest: Path) -> None:
    """下载图片 URL 并保存到文件"""
    if HAS_REQUESTS:
        import requests as _req
        r = _req.get(url, timeout=120)
        r.raise_for_status()
        dest.write_bytes(r.content)
    else:
        urllib.request.urlretrieve(url, dest)


def generate_with_retry(
    sdk_client,
    api_key: str,
    prompt: str,
    size: str,
    fmt: str,
    retries: int = 3,
    status_cb: Optional[Callable[[str], None]] = None,
) -> Optional[str]:
    """带指数退避重试的生成函数"""
    last_exc: Optional[Exception] = None
    for attempt in range(1, retries + 1):
        try:
            if sdk_client:
                return generate_image_stream(sdk_client, prompt, size, fmt, status_cb)
            else:
                return generate_image_http(api_key, prompt, size, fmt, status_cb)
        except Exception as exc:
            last_exc = exc
            if attempt < retries:
                wait = 2 ** attempt  # 2s, 4s, 8s
                if status_cb:
                    status_cb(f"重试 {attempt}/{retries-1}，等待 {wait}s...")
                time.sleep(wait)
    raise last_exc  # type: ignore


# ──────────────────────────────────────────────────────────────────
# 进度展示 (rich)
# ──────────────────────────────────────────────────────────────────

def run_with_rich(
    tasks: list[str],
    style: str,
    api_key: str,
    out_dir: Path,
    size: str,
    fmt: str,
    skip_existing: bool,
    sdk_client,
    retries: int,
    concurrency: int = 1,
) -> None:
    succeeded = 0
    failed: list[str] = []
    skipped = 0
    ext = "jpg" if fmt == "jpeg" else fmt
    lock = Lock()

    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description:<12}"),
        BarColumn(bar_width=26),
        MofNCompleteColumn(),
        TextColumn("[dim]{task.fields[status]}"),
        TimeElapsedColumn(),
        TimeRemainingColumn(),
        console=console,
        transient=False,
    ) as progress:
        overall = progress.add_task(
            f"[bold magenta]{STYLES[style]['name']}",
            total=len(tasks),
            status=f"并发 {concurrency}" if concurrency > 1 else "",
        )

        # 每个并发槽一个子进度行
        slot_tasks = {}
        if concurrency > 1:
            for i in range(min(concurrency, len(tasks))):
                tid = progress.add_task(f"  [dim]槽 {i+1}[/dim]", total=None, status="等待...")
                slot_tasks[i] = tid

        def process_card(card_id: str, slot: int) -> tuple[str, bool, str]:
            """返回 (card_id, success, message)"""
            meta = CARD_META[card_id]
            dest = out_dir / f"{card_id}.{ext}"

            if concurrency > 1 and slot in slot_tasks:
                progress.update(slot_tasks[slot], description=f"  [cyan]{meta['nameZh']}[/cyan]", status="")

            # 跳过已有
            if skip_existing and dest.exists() and dest.stat().st_size > 5000:
                return card_id, True, f"  [dim]=[/dim] {meta['nameZh']} [dim](跳过)[/dim]"

            prompt = build_prompt(card_id, style)
            t0 = time.time()

            def _status(msg: str) -> None:
                elapsed = time.time() - t0
                status_str = f"{msg} ({elapsed:.0f}s)"
                if concurrency > 1 and slot in slot_tasks:
                    progress.update(slot_tasks[slot], status=status_str)
                else:
                    progress.update(overall, status=status_str)

            try:
                url = generate_with_retry(
                    sdk_client, api_key, prompt, size, fmt,
                    retries=retries, status_cb=_status,
                )
                if not url:
                    raise ValueError("API 未返回 URL")
                _status("下载中...")
                download_image(url, dest)
                elapsed = time.time() - t0
                msg = (
                    f"  [green]✓[/green] {meta['nameZh']} [dim]({card_id})[/dim]"
                    f" [dim]→ {dest.name}  {elapsed:.0f}s[/dim]"
                )
                return card_id, True, msg
            except Exception as exc:
                msg = f"  [red]✗[/red] {meta['nameZh']} [dim]({card_id})[/dim]: [red]{exc}[/red]"
                return card_id, False, msg

        if concurrency <= 1:
            # ── 串行模式 ──
            for card_id in tasks:
                meta = CARD_META[card_id]
                progress.update(overall, description=f"[cyan]{meta['nameZh']}[/cyan]", status="")
                cid, ok, msg = process_card(card_id, 0)
                console.print(msg)
                if ok:
                    if "(跳过)" in msg:
                        skipped += 1
                    else:
                        succeeded += 1
                else:
                    failed.append(cid)
                progress.advance(overall)
                time.sleep(0.3)
        else:
            # ── 并发模式 ──
            with ThreadPoolExecutor(max_workers=concurrency) as pool:
                future_to_card = {
                    pool.submit(process_card, card_id, i % concurrency): card_id
                    for i, card_id in enumerate(tasks)
                }
                for future in as_completed(future_to_card):
                    cid, ok, msg = future.result()
                    with lock:
                        console.print(msg)
                        if ok:
                            if "(跳过)" in msg:
                                skipped += 1
                            else:
                                succeeded += 1
                        else:
                            failed.append(cid)
                        progress.advance(overall)

        # 清理槽行
        for tid in slot_tasks.values():
            progress.update(tid, visible=False)

    # ── 汇总 ──
    console.print()
    summary = (
        f"[green]成功:[/green] {succeeded} 张   "
        f"[yellow]跳过:[/yellow] {skipped} 张   "
        f"[red]失败:[/red] {len(failed)} 张"
    )
    if failed:
        summary += f"\n[red]失败列表:[/red] {', '.join(failed)}"
    console.print(Panel(
        summary,
        title="生成完成",
        border_style="green" if not failed else "yellow",
    ))


def run_plain(
    tasks: list[str],
    style: str,
    api_key: str,
    out_dir: Path,
    size: str,
    fmt: str,
    skip_existing: bool,
    sdk_client,
    retries: int,
) -> None:
    total = len(tasks)
    failed: list[str] = []
    ext = "jpg" if fmt == "jpeg" else fmt  # 前端期望 .jpg

    for i, card_id in enumerate(tasks, 1):
        meta = CARD_META[card_id]
        dest = out_dir / f"{card_id}.{ext}"
        print(f"[{i}/{total}] {meta['nameZh']} ({card_id})")

        if skip_existing and dest.exists() and dest.stat().st_size > 5000:
            print("  = 已存在，跳过")
            continue

        prompt = build_prompt(card_id, style)
        try:
            url = generate_with_retry(
                sdk_client, api_key, prompt, size, fmt, retries=retries,
                status_cb=lambda m: print(f"  … {m}"),
            )
            if not url:
                raise ValueError("API 未返回 URL")
            download_image(url, dest)
            print(f"  ✓ 已保存 → {dest.name}")
        except Exception as exc:
            failed.append(card_id)
            print(f"  ✗ 失败: {exc}")

        time.sleep(0.3)

    print(f"\n完成: 成功 {total - len(failed)}/{total}，失败 {len(failed)}")
    if failed:
        print("失败列表:", ", ".join(failed))


# ──────────────────────────────────────────────────────────────────
# 参数解析 & 主入口
# ──────────────────────────────────────────────────────────────────

def list_styles() -> None:
    if HAS_RICH:
        table = Table(title="可选生成风格", box=box.ROUNDED, border_style="purple")
        table.add_column("ID", style="cyan bold", no_wrap=True)
        table.add_column("名称", style="magenta")
        table.add_column("描述", style="white")
        for sid, sdata in STYLES.items():
            table.add_row(sid, sdata["name"], sdata["desc"])
        console.print(table)
    else:
        print("可选风格:")
        for sid, sdata in STYLES.items():
            print(f"  {sid:20s} {sdata['name']} — {sdata['desc']}")


def parse_cards(arg: str) -> list[str]:
    """解析 --cards 参数为 card_id 列表"""
    if arg == "all":
        return ALL_IDS
    if arg == "major":
        return MAJOR_IDS
    if arg == "wands":
        return WANDS_IDS
    if arg == "cups":
        return CUPS_IDS
    if arg == "swords":
        return SWORDS_IDS
    if arg == "pentacles":
        return PENTACLES_IDS

    # 逗号分隔的 id 列表
    ids = [x.strip() for x in arg.split(",") if x.strip()]
    unknown = [i for i in ids if i not in CARD_META]
    if unknown:
        error(f"未知牌 ID: {', '.join(unknown)}")
        sys.exit(1)
    return ids


def main() -> None:
    parser = argparse.ArgumentParser(
        description="使用 Seedream API 生成塔罗牌图片（支持流式输出 + 重试）",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("--style", default="classical",
                        help="生成风格 (默认: classical)，用 --list-styles 查看所有风格")
    parser.add_argument("--cards", default="all",
                        help="选择生成哪些牌: all | major | wands | cups | swords | pentacles | 逗号分隔的ID")
    parser.add_argument("--api-key", default=None,
                        help="方舟 API Key (默认读取 ARK_API_KEY 环境变量)")
    parser.add_argument("--size", default="1600x2848",
                        help="图片尺寸 (默认: 1600x2848，9:16 竖版 2K，适合塔罗牌)")
    parser.add_argument("--format", dest="fmt", default="jpeg",
                        choices=["jpeg", "png"],
                        help="输出格式 (默认: jpeg)；png 质量更好但文件更大")
    parser.add_argument("--retries", type=int, default=3,
                        help="失败重试次数，指数退避 (默认: 3)")
    parser.add_argument("-j", "--concurrency", type=int, default=1,
                        help="并发线程数，加速批量生成 (默认: 1，建议 2-4)")
    parser.add_argument("--skip-existing", action="store_true",
                        help="跳过已存在且大小正常的图片文件")
    parser.add_argument("--out-dir", default=None,
                        help="输出目录 (默认: <项目根>/public/cards/<style>)")
    parser.add_argument("--list-styles", action="store_true",
                        help="列出所有可用风格")
    parser.add_argument("--dry-run", action="store_true",
                        help="只打印将要生成的内容，不实际调用 API")

    args = parser.parse_args()

    if args.list_styles:
        list_styles()
        return

    # 风格校验
    if args.style not in STYLES:
        error(f"未知风格 '{args.style}'，用 --list-styles 查看可用风格")
        sys.exit(1)

    # API Key
    api_key = args.api_key or os.environ.get("ARK_API_KEY", "")
    if not api_key and not args.dry_run:
        error("未提供 API Key。请设置环境变量 ARK_API_KEY 或使用 --api-key 参数")
        sys.exit(1)

    # 初始化 SDK（流式输出需要 SDK，无 SDK 降级为普通 HTTP）
    sdk_client = None
    if HAS_VOLCENGINE_SDK and api_key:
        try:
            sdk_client = Ark(base_url=API_BASE, api_key=api_key)
        except Exception:
            sdk_client = None

    if not sdk_client and not args.dry_run:
        warn("volcengine SDK 未安装，降级为普通 HTTP（无流式进度）")
        warn("安装: pip install 'volcengine-python-sdk[ark]'")

    # 输出目录
    script_dir = Path(__file__).parent
    # 默认按风格分子目录：public/cards/{style}/
    default_out = script_dir.parent / "public" / "cards" / args.style
    out_dir = Path(args.out_dir) if args.out_dir else default_out
    out_dir.mkdir(parents=True, exist_ok=True)

    # 要生成的牌
    tasks = parse_cards(args.cards)
    # 文件扩展名：jpeg 格式存为 .jpg（与前端 card-images.ts 期望一致）
    ext = "jpg" if args.fmt == "jpeg" else args.fmt

    # ── 汇总信息 ──
    style_info = STYLES[args.style]
    if HAS_RICH:
        console.print(Panel(
            f"[bold cyan]风格:[/bold cyan]   {style_info['name']} ({args.style})\n"
            f"[bold cyan]牌数:[/bold cyan]   {len(tasks)} 张\n"
            f"[bold cyan]尺寸:[/bold cyan]   {args.size}\n"
            f"[bold cyan]格式:[/bold cyan]   {ext.upper()}  {'[dim](高质量)[/dim]' if ext == 'png' else ''}\n"
            f"[bold cyan]输出:[/bold cyan]   {out_dir}\n"
            f"[bold cyan]模式:[/bold cyan]   {'流式 (volcengine SDK)' if sdk_client else '普通 HTTP'}\n"
            f"[bold cyan]并发:[/bold cyan]   {args.concurrency} 线程{'  [dim](串行)[/dim]' if args.concurrency == 1 else f'  [green](×{args.concurrency} 加速)[/green]'}\n"
            f"[bold cyan]重试:[/bold cyan]   {args.retries} 次\n"
            f"[bold cyan]跳过:[/bold cyan]   {'是' if args.skip_existing else '否'}",
            title="🔮  塔罗牌 AI 图片生成",
            border_style="magenta",
        ))
    else:
        print(f"风格: {style_info['name']}  牌数: {len(tasks)}  尺寸: {args.size}  格式: {ext}")

    if args.dry_run:
        info("Dry-run 模式，仅打印提示词，不调用 API")
        for card_id in tasks:
            meta = CARD_META[card_id]
            prompt = build_prompt(card_id, args.style)
            print(f"\n── {meta['nameZh']} ({card_id}) ──")
            print(prompt)
        return

    # ── 执行生成 ──
    if HAS_RICH:
        run_with_rich(tasks, args.style, api_key, out_dir, args.size, ext,
                      args.skip_existing, sdk_client, args.retries,
                      concurrency=args.concurrency)
    else:
        run_plain(tasks, args.style, api_key, out_dir, args.size, ext,
                  args.skip_existing, sdk_client, args.retries)


if __name__ == "__main__":
    main()
