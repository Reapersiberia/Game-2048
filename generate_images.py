#!/usr/bin/env python3
"""
Генератор изображений для Base Mini App
Требуется: pip install pillow
"""
try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Установите Pillow: pip install pillow")
    exit(1)

def create_icon():
    img = Image.new('RGB', (512, 512), color='#667eea')
    draw = ImageDraw.Draw(img)
    # Градиент упрощенный
    for i in range(512):
        r = int(102 + (118-102)*i/512)
        g = int(126 + (75-126)*i/512)
        b = int(234 + (162-234)*i/512)
        color = (r, g, b)
        draw.rectangle([(0, i), (512, i+1)], fill=color)
    
    try:
        font = ImageFont.truetype("arial.ttf", 120)
    except:
        font = ImageFont.load_default()
    
    text = "2048"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    position = ((512 - text_width) // 2, (512 - text_height) // 2)
    draw.text(position, text, fill='white', font=font)
    img.save('icon.png')
    print("✓ Создан icon.png")

def create_og():
    img = Image.new('RGB', (1200, 630), color='#667eea')
    draw = ImageDraw.Draw(img)
    # Градиент
    for i in range(630):
        r = int(102 + (118-102)*i/630)
        g = int(126 + (75-126)*i/630)
        b = int(234 + (162-234)*i/630)
        color = (r, g, b)
        draw.rectangle([(0, i), (1200, i+1)], fill=color)
    
    try:
        font_title = ImageFont.truetype("arial.ttf", 80)
        font_sub = ImageFont.truetype("arial.ttf", 32)
    except:
        font_title = font_sub = ImageFont.load_default()
    
    draw.text((600, 250), "Game 2048", fill='white', font=font_title, anchor='mm')
    draw.text((600, 350), "Классическая логическая игра", fill='white', font=font_sub, anchor='mm')
    img.save('og.png')
    print("✓ Создан og.png")

def create_splash():
    img = Image.new('RGB', (1200, 675), color='black')
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("arial.ttf", 100)
        font_sub = ImageFont.truetype("arial.ttf", 36)
    except:
        font = font_sub = ImageFont.load_default()
    
    draw.text((600, 300), "2048", fill='white', font=font, anchor='mm')
    draw.text((600, 400), "Загрузка...", fill='white', font=font_sub, anchor='mm')
    img.save('splash.png')
    print("✓ Создан splash.png")

def create_embed():
    img = Image.new('RGB', (1200, 630), color='#f093fb')
    draw = ImageDraw.Draw(img)
    # Градиент розовый
    for i in range(630):
        r = int(240 + (245-240)*i/630)
        g = int(147 + (87-147)*i/630)
        b = int(251 + (108-251)*i/630)
        color = (r, g, b)
        draw.rectangle([(0, i), (1200, i+1)], fill=color)
    
    try:
        font = ImageFont.truetype("arial.ttf", 72)
        font_sub = ImageFont.truetype("arial.ttf", 28)
    except:
        font = font_sub = ImageFont.load_default()
    
    draw.text((600, 280), "Game 2048", fill='white', font=font, anchor='mm')
    draw.text((600, 360), "Играй прямо в Base app!", fill='white', font=font_sub, anchor='mm')
    img.save('embed-image.png')
    print("✓ Создан embed-image.png")

def create_screenshot():
    img = Image.new('RGB', (1200, 800), color='#faf8ef')
    draw = ImageDraw.Draw(img)
    
    try:
        font = ImageFont.truetype("arial.ttf", 60)
    except:
        font = ImageFont.load_default()
    
    draw.text((600, 100), "Game 2048", fill='#776e65', font=font, anchor='mm')
    
    # Игровая сетка
    grid_size = 4
    cell_size = 100
    start_x = (1200 - grid_size * cell_size) // 2
    start_y = 300
    
    # Рисуем сетку
    for i in range(grid_size + 1):
        x = start_x + i * cell_size
        draw.line([(x, start_y), (x, start_y + grid_size * cell_size)], fill='#bbada0', width=5)
        y = start_y + i * cell_size
        draw.line([(start_x, y), (start_x + grid_size * cell_size, y)], fill='#bbada0', width=5)
    
    # Плитки
    tiles = [(0, 0, 2), (1, 0, 4), (0, 1, 8), (2, 1, 16)]
    try:
        tile_font = ImageFont.truetype("arial.ttf", 40)
    except:
        tile_font = ImageFont.load_default()
    
    for x, y, value in tiles:
        px = start_x + x * cell_size + 10
        py = start_y + y * cell_size + 10
        draw.rectangle([(px, py), (px + cell_size - 20, py + cell_size - 20)], fill='#eee4da')
        bbox = draw.textbbox((0, 0), str(value), font=tile_font)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        draw.text((px + (cell_size - 20) // 2, py + (cell_size - 20) // 2), str(value), 
                 fill='#776e65', font=tile_font, anchor='mm')
    
    img.save('screenshot-1.png')
    print("✓ Создан screenshot-1.png")

if __name__ == "__main__":
    print("Создание изображений для Base Mini App...")
    try:
        create_icon()
        create_og()
        create_splash()
        create_embed()
        create_screenshot()
        print("\n✅ Все изображения созданы успешно!")
    except Exception as e:
        print(f"❌ Ошибка: {e}")
