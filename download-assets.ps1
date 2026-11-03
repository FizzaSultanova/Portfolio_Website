# Downloads every image/icon from the Figma design into the "assets" folder.
# Windows: right-click this file > "Run with PowerShell".
# NOTE: the Figma links are temporary (they expire ~7 days after 2 Nov 2026).
$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot
New-Item -ItemType Directory -Force -Path "assets" | Out-Null
$base = "https://www.figma.com/api/mcp/asset"
$files = @{
  "icon-dot.svg" = "5717edd8-db78-4dc4-b556-615af975791d.svg"
  "icon-quote.svg" = "d65ca185-0031-4985-bf8a-d7698e2be330.svg"
  "logo-blisko.png" = "84fcc978-313e-4b2a-acbc-3402e4c36568.png"
  "logo-amazon.png" = "12fe5ae9-501d-4c4d-bc18-662160b3a49d.png"
  "icon-arrow-up-right.svg" = "64836267-2196-4ce6-aa6c-5e8208b99f40.svg"
  "icon-caret-circle-right.svg" = "8b9ecd49-09a4-41a0-8246-bf3f8e85da36.svg"
  "icon-university.svg" = "51b9a871-a241-4a57-b31d-e88188a52353.svg"
  "icon-award.svg" = "7659073b-49b1-4c69-a656-59639c78b438.svg"
  "icon-globe.svg" = "d6545154-f692-4f39-8899-230467cf6160.svg"
  "logo-microsoft.png" = "2e65b3bf-4c1a-4b69-820b-266e4fcd58a8.png"
  "logo-cisco.png" = "b067d836-fbec-4a79-8de8-c52e79783d1b.png"
  "logo-vmware.png" = "b6dc1215-5eaa-4a94-9357-95a70877ee1d.png"
  "recognition-1.png" = "148e0738-c2fd-47ff-8536-2bb27d643a7e.png"
  "icon-arrow-circle.svg" = "8e4ced71-d31c-45a7-9e0c-febabbdd3309.svg"
  "icon-arrow-right.svg" = "fb01390e-dbb3-48d9-89a2-e26a28e80706.svg"
  "icon-chevron-left.svg" = "b7d5f1b3-a9bd-4f7e-bb95-f61165f05b18.svg"
  "contact-image.png" = "e4831fb7-4c6d-4658-9776-d2f6da9f3e21.png"
  "icon-envelope-field.svg" = "6704a35b-6440-4b3c-8197-1f2b58e0502a.svg"
  "icon-linkedin.svg" = "5e239d78-a7c2-414f-ba4b-7b432e720335.svg"
  "icon-facebook.svg" = "bb6b3a2f-4348-4ffb-8bcc-5784ee576396.svg"
  "icon-instagram.svg" = "79738161-8367-4783-86cc-71f4446d71e0.svg"
  "icon-envelope.svg" = "33fbe235-c896-41ff-961c-42d497cb5920.svg"
  "logo-moe.png" = "0a61953c-7e27-4cbc-8f9a-14d1ccaa31de.png"
  "logo-kufic.png" = "78bf9b36-d6a8-4dfd-9f7c-997210049c88.png"
  "icon-arrow-left.svg" = "aba32a29-b67b-4aaa-ac10-0eb0e52ed8f3.svg"
  "recognition-2.png" = "9f323342-bcf4-4633-ab7e-09bdca9fbc2a.png"
  "recognition-3.png" = "f03ab78a-bf9d-44c6-aa90-cdddf344d33f.png"
  "recognition-4.png" = "f34c6800-c2a0-41ab-a1a1-f270cd2a8cb3.png"
  "recognition-5.png" = "ad17088f-4385-4480-88e9-2f215824a9e9.png"
}
foreach ($name in $files.Keys) {
  Write-Host "-> assets/$name"
  Invoke-WebRequest -Uri "$base/$($files[$name])" -OutFile "assets/$name" -UseBasicParsing
}
Write-Host "Done. All assets saved in the assets folder."
Read-Host "Press Enter to close"
