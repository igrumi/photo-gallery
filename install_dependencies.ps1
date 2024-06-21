# Cambia al directorio backend e instala las dependencias
Write-Output "Instalando dependencias del backend..."
Set-Location -Path "backend"
if (Test-Path -Path "package.json") {
    npm install
} else {
    Write-Output "No se encontró package.json en el backend"
}

# Vuelve a la raíz del proyecto
Set-Location -Path ".."

# Cambia al directorio frontend e instala las dependencias
Write-Output "Instalando dependencias del frontend..."
Set-Location -Path "frontend"
if (Test-Path -Path "package.json") {
    npm install
} else {
    Write-Output "No se encontró package.json en el frontend"
}

Set-Location -Path ".."

Write-Output "Instalando dependencias del admin..."
Set-Location -Path "admin"
if (Test-Path -Path "package.json") {
    npm install
} else {
    Write-Output "No se encontró package.json en la carpeta admin"
}

Write-Output "Todas las dependencias han sido instaladas."
