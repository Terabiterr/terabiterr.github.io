import json
import os
from datetime import date
import xml.etree.ElementTree as ET

# =====================================================
# Настройки
# =====================================================

SITEMAP_NS = "http://www.sitemaps.org/schemas/sitemap/0.9"
ET.register_namespace("", SITEMAP_NS)

SITEMAP = "sitemap.xml"

COMPONENTS_JSON = "data/components.json"
PRODUCTS_JSON = "data/products.json"

BASE_URL = "https://zxkit.com.ua/products/template.html?id="

TODAY = date.today().isoformat()

# =====================================================
# Статические страницы
# =====================================================

STATIC_PAGES = {
    "https://zxkit.com.ua/": {
        "changefreq": "daily",
        "priority": "1.0"
    },
    "https://zxkit.com.ua/components.html": {
        "changefreq": "daily",
        "priority": "1.0"
    }
}

# =====================================================
# Загрузка JSON
# =====================================================

def load_json(path):
    if not os.path.exists(path):
        return []

    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

# =====================================================
# Формирование списка необходимых URL
# =====================================================

required_urls = dict(STATIC_PAGES)

# Компоненты
for item in load_json(COMPONENTS_JSON):
    required_urls[
        BASE_URL + item["id"] + "&isComponent=true"
    ] = {
        "changefreq": "monthly",
        "priority": "0.8"
    }

# Товары
for item in load_json(PRODUCTS_JSON):
    required_urls[
        BASE_URL + item["id"]
    ] = {
        "changefreq": None,
        "priority": "0.8"
    }

# =====================================================
# Открываем sitemap или создаём новый
# =====================================================

if os.path.exists(SITEMAP) and os.path.getsize(SITEMAP) > 0:

    tree = ET.parse(SITEMAP)
    root = tree.getroot()

else:

    root = ET.Element(f"{{{SITEMAP_NS}}}urlset")
    tree = ET.ElementTree(root)

# =====================================================
# Существующие URL
# =====================================================

existing = {}

for node in root.findall(f"{{{SITEMAP_NS}}}url"):

    loc = node.find(f"{{{SITEMAP_NS}}}loc")

    if loc is not None:
        existing[loc.text] = node

# =====================================================
# Добавление новых URL
# =====================================================

added = 0

for url, info in required_urls.items():

    if url in existing:
        continue

    url_node = ET.SubElement(root, f"{{{SITEMAP_NS}}}url")

    ET.SubElement(
        url_node,
        f"{{{SITEMAP_NS}}}loc"
    ).text = url

    ET.SubElement(
        url_node,
        f"{{{SITEMAP_NS}}}lastmod"
    ).text = TODAY

    if info["changefreq"]:

        ET.SubElement(
            url_node,
            f"{{{SITEMAP_NS}}}changefreq"
        ).text = info["changefreq"]

    ET.SubElement(
        url_node,
        f"{{{SITEMAP_NS}}}priority"
    ).text = info["priority"]

    added += 1

# =====================================================
# Удаление отсутствующих URL
# =====================================================

removed = 0

for node in list(root.findall(f"{{{SITEMAP_NS}}}url")):

    loc = node.find(f"{{{SITEMAP_NS}}}loc")

    if loc is None:
        continue

    if loc.text not in required_urls:
        root.remove(node)
        removed += 1

# =====================================================
# Красивое форматирование
# =====================================================

ET.indent(tree, space="  ")

tree.write(
    SITEMAP,
    encoding="utf-8",
    xml_declaration=True
)

# =====================================================
# Итог
# =====================================================

print("=" * 45)
print(" Sitemap успешно обновлён")
print("=" * 45)
print(f"Добавлено : {added}")
print(f"Удалено   : {removed}")
print(f"Всего URL : {len(required_urls)}")
print("=" * 45)