#!/usr/bin/env bash
# Downloads every image/icon used by index.html from the Figma design into ./assets.
# Run from the portfolio folder:   bash download-assets.sh
# NOTE: these Figma export links are temporary (they expire ~7 days after 2 Nov 2026).
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p assets
F="https://www.figma.com/api/mcp/asset"

get() { echo "-> assets/$1"; curl -fsSL -o "assets/$1" "$F/$2"; }

# Hero
get icon-dot.svg               5717edd8-db78-4dc4-b556-615af975791d.svg
# Teaching quote
get icon-quote.svg             d65ca185-0031-4985-bf8a-d7698e2be330.svg
# What I'm building
get logo-blisko.png            84fcc978-313e-4b2a-acbc-3402e4c36568.png
get logo-amazon.png            12fe5ae9-501d-4c4d-bc18-662160b3a49d.png
get icon-arrow-up-right.svg    64836267-2196-4ce6-aa6c-5e8208b99f40.svg
get icon-caret-circle-right.svg 8b9ecd49-09a4-41a0-8246-bf3f8e85da36.svg
# Education / skills / language
get icon-university.svg        51b9a871-a241-4a57-b31d-e88188a52353.svg
get icon-award.svg             7659073b-49b1-4c69-a656-59639c78b438.svg
get icon-globe.svg             d6545154-f692-4f39-8899-230467cf6160.svg
# Certifications
get logo-microsoft.png         2e65b3bf-4c1a-4b69-820b-266e4fcd58a8.png
get logo-cisco.png             b067d836-fbec-4a79-8de8-c52e79783d1b.png
get logo-vmware.png            b6dc1215-5eaa-4a94-9357-95a70877ee1d.png
# Recognition
get recognition-1.png          148e0738-c2fd-47ff-8536-2bb27d643a7e.png
get icon-arrow-circle.svg      8e4ced71-d31c-45a7-9e0c-febabbdd3309.svg
# Projects
get icon-arrow-right.svg       fb01390e-dbb3-48d9-89a2-e26a28e80706.svg
get icon-chevron-left.svg      b7d5f1b3-a9bd-4f7e-bb95-f61165f05b18.svg
# Contact
get contact-image.png          e4831fb7-4c6d-4658-9776-d2f6da9f3e21.png
get icon-envelope-field.svg    6704a35b-6440-4b3c-8197-1f2b58e0502a.svg
get icon-linkedin.svg          5e239d78-a7c2-414f-ba4b-7b432e720335.svg
get icon-facebook.svg          bb6b3a2f-4348-4ffb-8bcc-5784ee576396.svg
get icon-instagram.svg         79738161-8367-4783-86cc-71f4446d71e0.svg
get icon-envelope.svg          33fbe235-c896-41ff-961c-42d497cb5920.svg

# Teaching AI slide + project card back
get logo-moe.png               0a61953c-7e27-4cbc-8f9a-14d1ccaa31de.png
get logo-kufic.png             78bf9b36-d6a8-4dfd-9f7c-997210049c88.png
get icon-arrow-left.svg        aba32a29-b67b-4aaa-ac10-0eb0e52ed8f3.svg

# Recognition photos 2-5
get recognition-2.png          9f323342-bcf4-4633-ab7e-09bdca9fbc2a.png
get recognition-3.png          f03ab78a-bf9d-44c6-aa90-cdddf344d33f.png
get recognition-4.png          f34c6800-c2a0-41ab-a1a1-f270cd2a8cb3.png
get recognition-5.png          ad17088f-4385-4480-88e9-2f215824a9e9.png

echo "Done. All assets saved in ./assets"
