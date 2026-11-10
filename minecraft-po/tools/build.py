"""Check the add-on files and pack them into dist/Po.mcaddon.

Run:  python3 minecraft-po/tools/build.py
"""
import json
import os
import re
import sys
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ADDON = os.path.join(ROOT, "addon")
DIST = os.path.join(ROOT, "dist")
PACKS = ["Po_BP", "Po_RP"]


def check():
    errors = []
    for pack in PACKS:
        base = os.path.join(ADDON, pack)
        for folder, _, files in os.walk(base):
            for name in files:
                path = os.path.join(folder, name)
                rel = os.path.relpath(path, ADDON)
                if name.endswith(".json"):
                    try:
                        with open(path, encoding="utf-8") as f:
                            json.load(f)
                    except Exception as e:  # noqa: BLE001
                        errors.append(f"{rel}: bad JSON: {e}")
                if name.endswith(".lang"):
                    with open(path, encoding="utf-8") as f:
                        for i, line in enumerate(f, 1):
                            if line.strip() and "=" not in line:
                                errors.append(f"{rel}:{i}: lang line without '='")

    bp = json.load(open(os.path.join(ADDON, "Po_BP", "manifest.json"), encoding="utf-8"))
    rp = json.load(open(os.path.join(ADDON, "Po_RP", "manifest.json"), encoding="utf-8"))
    rp_dep = [d for d in bp["dependencies"] if d.get("uuid") == rp["header"]["uuid"]]
    if not rp_dep:
        errors.append("Po_BP manifest does not depend on Po_RP")
    elif rp_dep[0]["version"] != rp["header"]["version"]:
        errors.append("Po_BP depends on a different Po_RP version than Po_RP's header")
    if bp["header"]["version"] != rp["header"]["version"]:
        errors.append("Po_BP and Po_RP versions differ")

    entry = os.path.join(ADDON, "Po_BP", bp["modules"][1]["entry"])
    if not os.path.exists(entry):
        errors.append(f"script entry missing: {entry}")
    # every relative import in the scripts must exist
    scripts = os.path.join(ADDON, "Po_BP", "scripts")
    for name in os.listdir(scripts):
        src = open(os.path.join(scripts, name), encoding="utf-8").read()
        for imp in re.findall(r'from "(\./[^"]+)"', src):
            if not os.path.exists(os.path.join(scripts, imp)):
                errors.append(f"scripts/{name}: import {imp} not found")
    for need in ["textures/entity/po.png", "textures/items/po_whistle.png", "pack_icon.png"]:
        if not os.path.exists(os.path.join(ADDON, "Po_RP", need)):
            errors.append(f"Po_RP/{need} missing (run tools/make_textures.py)")
    return errors, bp["header"]["version"]


def build(version):
    os.makedirs(DIST, exist_ok=True)
    out = os.path.join(DIST, "Po.mcaddon")
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        for pack in PACKS:
            base = os.path.join(ADDON, pack)
            for folder, _, files in sorted(os.walk(base)):
                for name in sorted(files):
                    path = os.path.join(folder, name)
                    z.write(path, os.path.relpath(path, ADDON))
    print(f"built {os.path.relpath(out, ROOT)} (v{'.'.join(map(str, version))}, {os.path.getsize(out)} bytes)")


if __name__ == "__main__":
    errs, ver = check()
    if errs:
        print("\n".join(errs))
        sys.exit(1)
    build(ver)
