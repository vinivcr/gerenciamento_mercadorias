from PIL import Image

# Abra a imagem PNG
png_image = Image.open("logo.png")

# Converta a imagem para o formato .ico
png_image.save("imagem.ico", format="ICO")
