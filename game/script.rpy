# Определение персонажей
define jin = Character('Мастер Цзинь Юн', color="#4169E1")
define lin = Character('Линь Шуй', color="#FF69B4")
define mao = Character('???', color="#800000")
define feng = Character('Фэн Цзинь', color="#FF4500")
define Mao_a = Character('')

init python:
    import copy
    
    def number_to_words(level):
        levels = {
            1: "Семя Силы",
            2: "Пробуждение Ци",
            3: "Формирование Ядра",
            4: "Закалка Тела",
            5: "Слияние с Дао",
            6: "Познание Пустоты",
            7: "Возвращение к Истоку",
            8: "Бессмертный Дух",
            9: "Превосходящий Небеса"
        }
        return levels.get(level, f"Уровень {level}")



# Определение всех предметов
define items = {
    # Базовые предметы
    "wooden_sword": {
        "name": "Деревянный меч",
        "type": "weapon",
        "icon": "🗡️",
        "attack_bonus": 3,
        "description": "Простой деревянный меч для тренировок."
    },
    "training_robe": {
        "name": "Тренировочная роба",
        "type": "armor",
        "icon": "👘",
        "defense_bonus": 2,
        "description": "Стандартная роба ученика секты."
    },
    "beginner_pill": {
        "name": "Пилюля начала",
        "type": "consumable",
        "icon": "💊",
        "qi_bonus": 10,
        "description": "пилюля, нужная для прорыва на стадию семя силы"
    }
}

# Инициализация инвентаря
default inventory = {
    "items": [],  # Список предметов в инвентаре
    "equipped": {  # Экипированные предметы
        "weapon": None,
        "armor": None,
        "boots": None,
        "accessory": None
    }
}



    # Обновляем предметы после их определения


# Инициализация переменных
default player_level = 1
default player_exp = 0
default current_skin = "default"

default hero_stats = {
    "name": "Хиро",
    "level": 1,
    "attack": 10,
    "crit_chance": 5,
    "defense": 5,
    "speed": 3,
    "health": 100,
    "max_health": 100,
    "qi": 10,
    "max_qi": 10,
    "exp": 0,
    "exp_to_next_level": 100,
    "talent": 1.0,
    "abilities": {
        "swift_strike": {
            "name": "Стремительный удар",
            "damage_mult": 1.5,
            "qi_cost": 2,
            "description": "Быстрый удар с увеличенной скоростью"
        },
        "power_strike": {
            "name": "Силовой удар",
            "damage_mult": 2.0,
            "qi_cost": 3,
            "description": "Мощный удар с концентрацией Ци"
        },
        "dragon_fang": {
            "name": "Клык дракона",
            "damage_mult": 2.5,
            "qi_cost": 4,
            "description": "Легендарная техника удара в стиле дракона"
        }
    }
}

# В начале файла добавим определение противников
default enemies = {
    "training_dummy": {
        "name": "Тренировочный манекен",
        "level": 1,
        "attack": 5,
        "defense": 8,
        "health": 100,
        "max_health": 100,
        "speed": 3,
        "crit_chance": 5,
        "abilities": {
            "wooden_strike": {
                "name": "Деревянный удар",
                "damage_mult": 1.5,
                "description": "Концентрирует силу в своей деревянной руке"
            },
            "training_combo": {
                "name": "Тренировочная комбинация",
                "damage_mult": 1.8,
                "description": "Проводит серию тренировочных ударов"
            },
            "power_strike": {
                "name": "Силовой удар",
                "damage_mult": 2.0,
                "description": "Собирает всю свою силу для мощного удара"
            }
        }
    }
}

# Список для настройки максимального опыта для каждого уровня
default exp_requirements = [0, 100, 200, 300, 600, 1200, 2400, 4800, 9600]  # Настройте по своему усмотрению

# Список доступных локаций
default locations = [
    {"name": "secta_sky_blades", "xpos": 100, "ypos": 150, "required_level": 1},
    {"name": "Секта Тысячи Лун", "xpos": 400, "ypos": 300, "required_level": 3},
    {"name": "Секта Бесконечной Горы", "xpos": 700, "ypos": 100, "required_level": 5},
    {"name": "Секта Кровавого Дракона", "xpos": 650, "ypos": 500, "required_level": 7},
]
define skins = {
    "default": "images/mry_dgh_angry.png",  # Стандартный скин
    "training": "images/MRY_GRANDPEONY_ANGRY.png",  # Тренировочная одежда
    "formal": "images/MRY_BUTTERFLYDREAM_ANGRY.png",  # Официальная одежда
}

# В начале файла добавим определение доступных для изучения способностей
default available_abilities = {
    "swift_strike": {
        "name": "Стремительный удар",
        "damage_mult": 1.5,
        "qi_cost": 2,
        "description": "Быстрый удар с увеличенной скоростью",
        "requirements": {
            "level": "Семя Силы",  # Уровень 2
            "qi": 5,
            "speed": 5
        },
        "learned": False
    },
    "power_strike": {
        "name": "Силовой удар",
        "damage_mult": 2.0,
        "qi_cost": 3,
        "description": "Мощный удар с концентрацией Ци",
        "requirements": {
            "level": "Поток Энергии",  # Уровень 3
            "qi": 8,
            "attack": 12
        },
        "learned": False
    },
    "dragon_fang": {
        "name": "Клык дракона",
        "damage_mult": 2.5,
        "qi_cost": 4,
        "description": "Легендарная техника удара в стиле дракона",
        "requirements": {
            "level": "Железная Воля",  # Уровень 4
            "qi": 10,
            "attack": 15,
            "speed": 8
        },
        "learned": False
    }
}



init python:
    import requests
    import json
    import copy  # Добавляем импорт для глубокого копирования

    if not hasattr(persistent, 'player_entered'):
        persistent.player_entered = False

    def player_entered():
        if not persistent.player_entered:
            try:
                response = requests.post('http://localhost:3000/players')
                if response.status_code == 200:
                    persistent.player_entered = True
                    return response.json().get('player_count', 0)
                else:
                    return 0
            except Exception as e:
                print(f"Ошибка при отправке данных на сервер: {e}")
                return 0
        else:
            return get_player_count()

    def player_left():
        if persistent.player_entered:
            try:
                requests.post('http://localhost:3000/players/leave')
                persistent.player_entered = False
            except Exception as e:
                print(f"Ошибка при отправке данных на сервер: {e}")

    def get_player_count():
        try:
            response = requests.get('http://localhost:3000/players')
            if response.status_code == 200:
                return response.json().get('player_count', 0)
            else:
                return 0
        except Exception as e:
            print(f"Ошибка при получении данных с сервера: {e}")
            return 0

    def quit_game_action():
        player_left()
        renpy.quit()

    config.quit_action = quit_game_action

    player_count = 0

    def update_player_count():
        global player_count
        player_count = get_player_count()
        renpy.restart_interaction()  # Обновление GUI после изменения данных

    def add_item(item_id):
        """Добавляет предмет в инвентарь"""
        global inventory, items
        if item_id in items:
            inventory["items"].append(item_id)
            renpy.notify(f"Добавлен предмет: {items[item_id]['name']}")
            return True
        else:
            renpy.notify(f"Ошибка: предмет {item_id} не найден")
            return False

    def remove_item(item_id):
        """Удаляет предмет из инвентаря"""
        global inventory
        if item_id in inventory["items"]:
            inventory["items"].remove(item_id)
            return True
        return False

    def equip_item(item_id):
        """Экипирует предмет"""
        global inventory, items, hero_stats
        if item_id in inventory["items"] and item_id in items:
            item = items[item_id]
            slot = item["type"]
            if slot in inventory["equipped"]:
                # Если в слоте уже есть предмет, снимаем его
                if inventory["equipped"][slot]:
                    unequip_item(inventory["equipped"][slot])
                # Экипируем новый предмет
                inventory["equipped"][slot] = item_id
                # Применяем бонусы предмета
                if "attack_bonus" in item:
                    hero_stats["attack"] += item["attack_bonus"]
                if "defense_bonus" in item:
                    hero_stats["defense"] += item["defense_bonus"]
                return True
        return False

    def unequip_item(item_id):
        """Снимает предмет"""
        global inventory, items, hero_stats
        if item_id in items:
            item = items[item_id]
            slot = item["type"]
            if slot in inventory["equipped"] and inventory["equipped"][slot] == item_id:
                # Убираем бонусы предмета
                if "attack_bonus" in item:
                    hero_stats["attack"] -= item["attack_bonus"]
                if "defense_bonus" in item:
                    hero_stats["defense"] -= item["defense_bonus"]
                inventory["equipped"][slot] = None
                return True
        return False

# Вызываем функцию обновления предметов при инициализации


# Экран интерактивной карты
screen map_screen():
    # Растягиваем карту на весь экран
    add "map_image.webp" at truecenter  # Используем изображение карты как фон

    # Кнопки с улучшенным дизайном
    for location in locations:
        if player_level >= location["required_level"]:
            frame:
                background Solid("#000000AA")  # Полупрозрачный чёрный фон
                xsize 200
                ysize 50
                xpos location["xpos"]  # Позиция кнопки по горизонтали
                ypos location["ypos"]  # Позиция кнопки по вертикали
                textbutton location["name"] action Jump(location["name"]) style "map_button"
        else:
            frame:
                background Solid("#555555AA")  # Полупрозрачный серый фон
                xsize 200
                ysize 50
                xpos location["xpos"]
                ypos location["ypos"]
                textbutton location["name"] action NullAction() style "map_button_disabled" tooltip "Недоступно: Требуется стадия культивации [number_to_words(location['required_level'])]"

style map_button:
    font "DejaVuSans.ttf"  # Укажите ваш шрифт
    size 26  # Увеличенный размер текста
    color "#FFFFFF"  # Белый цвет текста
    hover_color "#FFFF00"  # Жёлтый цвет текста при наведении
    outlines [(2, "#ffffff", 0, 0)]  # Толстая чёрная обводка текста для читабельности
    text_align 0.5  # Центрирование текста по горизонтали

style map_button_disabled:
    font "DejaVuSans.ttf"  # Укажите ваш шрифт
    size 26
    color "#AAAAAA"  # Серый цвет текста
    outlines [(2, "#000000", 0, 0)]  # Толстая чёрная обводка текста
    text_align 0.5

init python:
    # Координаты кнопок на карте
    locations = [
        {"name": "secta_sky_blades_map", "xpos": 150, "ypos": 100, "required_level": 1},
        {"name": "Секта Тысячи Лун", "xpos": 400, "ypos": 300, "required_level": 3},
        {"name": "Секта Бесконечной Горы", "xpos": 700, "ypos": 150, "required_level": 5},
        {"name": "Секта Кровавого Дракона", "xpos": 700, "ypos": 500, "required_level": 7},
    ]

label start:
    # Начало игры

    # Инициализация инвентаря
    $ inventory = {
        "items": [],
        "equipped": {
            "weapon": None,
            "armor": None,
            "boots": None,
            "accessory": None
        }
    }

    # Выдача начальных предметов
    $ add_item("wooden_sword")
    $ add_item("training_robe")

    # Появление Мастера Цзинь Юна

    
    # Инициализация характеристик героя
    $ hero_stats["talent"] = renpy.random.uniform(0.5, 1.5)
    $ hero_stats["qi"] = 10
    $ hero_stats["max_qi"] = 10
    $ hero_stats["health"] = 100
    $ hero_stats["max_health"] = 100
    $ hero_stats["exp"] = 0
    $ hero_stats["exp_to_next_level"] = 100

    "Твой талант: [hero_stats['talent']:.2f]."
    "Твой начальный запас Ци: [hero_stats['qi']]."

    # Вызов карты
    call screen secta_sky_blades_map
    return

# После метки start добавим новую метку для показа карты
label show_map:
    call screen map_screen
    return

# Локации
# Экран интерактивной карты

# Метки локаций (без кавычек)
screen secta_sky_blades_map():
    # Растягиваем карту Секты Небесных Острий на весь экран
    add "secta_sky_blades_top_down.webp" at truecenter  # Укажите ваш файл карты

    # Главное здание (Храм секты)
    textbutton "Главное здание":
        action Jump("main_temple")
        xpos 800
        ypos 400
        xanchor 0.5
        yanchor 0.5
        style "map_location_button"

    # Тренировочная площадка
    textbutton "Тренировочная площадка":
        action Jump("training_ground")
        xpos 400
        ypos 700
        xanchor 0.5
        yanchor 0.5
        style "map_location_button"

    # Дом главного героя
    textbutton "Дом ГГ":
        action Jump("hero_house")
        xpos 200
        ypos 200
        xanchor 0.5
        yanchor 0.5
        style "map_location_button"

    # Дома учеников
    textbutton "Дома учеников":
        action Jump("student_houses")
        xpos 600
        ypos 500
        xanchor 0.5
        yanchor 0.5
        style "map_location_button"

    # Кнопка выхода
    textbutton "Вернуться":
        action Jump("show_map")
        xpos 900
        ypos 900
        xanchor 0.5
        yanchor 0.5
        style "map_exit_button"

# Стили для кнопок карты
style map_location_button:
    font "DejaVuSans.ttf"  # Укажите ваш шрифт
    size 20
    color "#FFFFFF"
    hover_color "#FFFF00"
    background Solid("#000000AA")  # Полупрозрачный фон
    padding (10, 10)
    align (0.5, 0.5)  # Центрирование текста

style map_exit_button:
    font "DejaVuSans.ttf"
    size 20
    color "#FF0000"
    hover_color "#FF5555"
    background Solid("#550000AA")  # Красный полупрозрачный фон
    padding (10, 10)
    align (0.5, 0.5)

# Координаты кнопок соответствуют карте.

# Метки локаций
label secta_sky_blades:
    # Переход на карту
    call screen secta_sky_blades_map
    return

label main_temple:
    scene bg main_temple
    "Ты вошёл в главное здание секты. Здесь проходят собрания и хранятся важные свитки."
    return


screen wardrobe_screen():
    tag menu

    vbox:
        align (0.5, 0.5)
        spacing 10
        text "Выберите одежду" size 30 color "#FFFFFF"

        textbutton "Обычная одежда":
            action [SetVariable("current_skin", "default"), Return()]
        textbutton "Тренировочная одежда":
            action [SetVariable("current_skin", "training"), Return()]
        textbutton "Официальная одежда":
            action [SetVariable("current_skin", "formal"), Return()]
        textbutton "Вернуться":
            action Return()

# Экран для отображения текущего скина
screen hero_sprite():
    add skins[current_skin]:
        xpos 10
        ypos 300

# Экран инвентаря
screen inventory_screen():
    modal True
    
    frame:
        xalign 0.5
        yalign 0.5
        xsize 800
        ysize 600
        background Solid("#000000CC")
        
        vbox:
            spacing 20
            xalign 0.5
            yalign 0.1
            
            text "Инвентарь" size 40 xalign 0.5 color "#FFFFFF"
            
            # Экипированные предметы
            frame:
                background Solid("#222222")
                xsize 750
                padding (10, 10)
                
                vbox:
                    spacing 10
                    text "Экипировка:" size 30 color "#FFFFFF"
                    
                    for slot, item_id in inventory["equipped"].items():
                        hbox:
                            spacing 10
                            text f"{slot.capitalize()}: " size 24 color "#AAAAAA"
                            if item_id:
                                $ item = items[item_id]
                                text f"{item['icon']} {item['name']}" size 24 color "#FFFFFF"
                                textbutton "Снять" action [Function(unequip_item, item_id), Return("")] text_size 20
                            else:
                                text "Пусто" size 24 color "#666666"
            
            # Предметы в инвентаре
            frame:
                background Solid("#222222")
                xsize 750
                padding (10, 10)
                vbox:
                    spacing 10
                    text "Предметы:" size 30 color "#FFFFFF"
                    $ unequipped_items = [item_id for item_id in inventory["items"] if item_id not in inventory["equipped"].values()]
                    if unequipped_items:
                        viewport:
                            mousewheel True
                            scrollbars "vertical"
                            draggable True
                            ymaximum 220
                            xmaximum 700
                            vbox:
                                spacing 5
                                for item_id in unequipped_items:
                                    $ item = items[item_id]
                                    frame:
                                        background Solid("#333333")
                                        padding (5, 5)
                                        vbox:
                                            text f"{item['icon']} {item['name']}" size 24 color "#FFFFFF"
                                            text item["description"] size 18 color "#AAAAAA"
                                            hbox:
                                                spacing 10
                                                if item["type"] != "consumable":
                                                    textbutton "Экипировать" action [Function(equip_item, item_id), Return("")] text_size 20
                    else:
                        text "Нет доступных предметов" size 22 color "#AAAAAA"
            
            textbutton "Закрыть" action Return("close") xalign 0.5

# Добавляем опцию инвентаря в дом героя
label hero_house_inside:
    scene bg hero_house_inside
    show screen hero_sprite
    "Ты находишься внутри своего дома. Это место, где можно отдохнуть и подумать о пути вперед."

    while True:
        menu:
            "Выйти наружу":
                jump hero_house
            "Подойти к шкафу":
                call screen wardrobe_screen
                "Ты выбрал новую одежду."
            "Изучить техники 📚":
                call learn_abilities from _call_learn_abilities
            "Открыть инвентарь 🎒":
                $ inventory_open = True
                while inventory_open:
                    $ result = renpy.call_screen("inventory_screen")
                    if result == "close":
                        $ inventory_open = False
                "В твоем инвентаре [len(inventory['items'])] предметов."
            "Получить начальные предметы 🗡️":
                if "wooden_sword" not in inventory["items"] or "training_robe" not in inventory["items"]:
                    $ add_item("wooden_sword")
                    $ add_item("training_robe")
                    "Ты получил деревянный меч и тренировочную робу."
                else:
                    "У тебя уже есть эти предметы."
            "Тренировочный бой 🗡️":
                "Ты решил потренироваться на манекене."
                $ enemy = copy.deepcopy(enemies["training_dummy"])
                call battle("training_dummy") from _call_battle
                scene bg hero_house_inside
                show screen hero_sprite
                "Тренировка окончена."
            "Вернуться на карту":
                call screen secta_sky_blades_map
                return

# Добавление скина в диалоги
label some_conversation:
    show screen hero_sprite
    Mao_a "Твоя текущая стадия культивации: [number_to_words(hero_stats['level'])]."
    hide screen hero_sprite
    return

label hero_house:
    # Показываем внешний вид дома главного героя
    scene bg hero_house_outside at truecenter
    "Ты стоишь перед своим домом, окружённым тишиной и природой."

    menu:
        "Зайти внутрь":
            jump hero_house_inside
        "Вернуться":
            call screen secta_sky_blades_map
            return

label student_houses:
    scene bg student_houses
    "Ты находишься в районе домов учеников. Это место для отдыха и общения между учениками."
    return


label sect_thousand_moons:
    scene bg sect_thousand_moons
    Mao_a "Ты прибыл в Секту Тысячи Лун."
    return

label sect_endless_mountain:
    scene bg sect_endless_mountain
    Mao_a "Ты прибыл в Секту Бесконечной Горы."
    return

label sect_blood_dragon:
    scene bg sect_blood_dragon
    Mao_a "Ты прибыл в Секту Кровавого Дракона."
    return


image bg hero_house_outside = "images/hero_house_outside.png"
image bg hero_house_inside = "images/hero_house_inside.png"
transform fullscreen:
    xalign 0.5
    yalign 0.5
    zoom 1.0  # Увеличивает изображение до полного экрана

# Qi and Talent System Additions
init python:
    def cultivate_qi():
        global hero_stats
        
        # Проверяем, достиг ли игрок максимума опыта для текущего уровня
        if hero_stats["exp"] >= hero_stats["exp_to_next_level"]:
            return {
                "event_text": "Ты достиг предела на текущей стадии. Необходимо совершить прорыв для дальнейшего развития.",
                "qi_gain": 0,
                "exp_gain": 0
            }
        
        # Случайные события во время медитации
        events = [
            {"text": "Ты достиг глубокого состояния медитации!", "bonus": 2.0},
            {"text": "Пролетающая бабочка отвлекла тебя...", "bonus": 0.5},
            {"text": "Ты почувствовал связь с природной энергией!", "bonus": 1.5},
            {"text": "Старший брат храпел рядом, но ты сохранил концентрацию", "bonus": 1.2},
            {"text": "Священный феникс пролетел над головой!", "bonus": 3.0},
            {"text": "Ты случайно заснул во время медитации", "bonus": 0.3}
        ]
        
        event = renpy.random.choice(events)
        base_qi_gain = int(10 * hero_stats["talent"])
        qi_gain = int(base_qi_gain * event["bonus"])
        
        hero_stats["max_qi"] += qi_gain
        hero_stats["qi"] = hero_stats["max_qi"]

        exp_gain = int(20 * hero_stats["talent"] * event["bonus"])
        # Проверяем, чтобы не превысить максимальный опыт
        if hero_stats["exp"] + exp_gain > hero_stats["exp_to_next_level"]:
            exp_gain = hero_stats["exp_to_next_level"] - hero_stats["exp"]
        hero_stats["exp"] += exp_gain

        return {
            "event_text": event["text"],
            "qi_gain": qi_gain,
            "exp_gain": exp_gain
        }

    def physical_training():
        global hero_stats
        
        training_events = [
            {"text": "Ты отжался 100 раз на одном пальце!", "bonus": 3, "stat": "attack"},
            {"text": "Ты пробежал от демонической собаки...", "bonus": 2, "stat": "speed"},
            {"text": "Ты поднял огромный камень!", "bonus": 2, "stat": "attack"},
            {"text": "Старейшина заставил тебя носить воду целый день", "bonus": 1, "stat": "defense"},
            {"text": "Ты случайно разбил тренировочный манекен", "bonus": 1, "stat": "attack"},
            {"text": "Ты медитировал под водопадом", "bonus": 2, "stat": "defense"}
        ]
        
        event = renpy.random.choice(training_events)
        stat_gain = event["bonus"]
        stat_name = event["stat"]
        
        hero_stats[stat_name] += stat_gain
        
        bonus_text = ""
        if renpy.random.random() < 0.1:  # 10% шанс
            bonus_qi = renpy.random.randint(1, 5)
            hero_stats["max_qi"] += bonus_qi
            hero_stats["qi"] = hero_stats["max_qi"]
            bonus_text = f"\nОсобое достижение! Бонус к Ци +{bonus_qi}!"

        return {
            "event_text": event["text"],
            "stat_name": stat_name,
            "stat_gain": stat_gain,
            "bonus_text": bonus_text
        }

    # Calculate damage in battle
    def calculate_damage(attacker, defender):
        import random
        base_damage = max(0, attacker["attack"] - defender["defense"])
        if random.randint(1, 100) <= attacker["crit_chance"]:
            base_damage *= 2  # Critical hit
        return base_damage

    # Set up random talent and initial Qi
    def setup_talent_and_qi():
        global hero_stats
        hero_stats["talent"] = random.uniform(0.5, 1.5)  # Talent from 0.5 to 1.5
        hero_stats["qi"] = 10
        hero_stats["max_qi"] = 10
        renpy.notify(f"Твой талант: {hero_stats['talent']:.2f}. Чем выше талант, тем быстрее ты увеличиваешь Ци.")
        renpy.notify(f"Твой начальный запас Ци: {hero_stats['max_qi']}.")

# Training Ground for Cultivation
label training_ground:
    scene bg training_ground with dissolve
    "Ты находишься на тренировочной площадке. Здесь ученики становятся сильнее."

    menu:
        "Медитировать 🧘":
            if hero_stats["exp"] >= hero_stats["exp_to_next_level"]:
                "Ты достиг предела на текущей стадии. Необходимо совершить прорыв для дальнейшего развития."
                jump training_ground
            $ result = cultivate_qi()
            "[result['event_text']]"
            if result['qi_gain'] > 0 or result['exp_gain'] > 0:
                "Ци увеличено на [result['qi_gain']]!\nОпыт увеличен на [result['exp_gain']]!"
            jump training_ground

        "Тренироваться 💪":
            $ result = physical_training()
            "[result['event_text']]"
            "[result['stat_name'].capitalize()] увеличен на [result['stat_gain']]!"
            if result['bonus_text']:
                "[result['bonus_text']]"
            jump training_ground

        "Совершить прорыв 🌟" if hero_stats["exp"] >= hero_stats["exp_to_next_level"]:
            python:
                old_level = hero_stats["level"]
                if old_level == 1:  # Первый прорыв
                    if "beginner_pill" in inventory["items"]:
                        hero_stats["level"] += 1
                        hero_stats["exp"] = 0
                        hero_stats["exp_to_next_level"] = exp_requirements[hero_stats["level"]]
                        hero_stats["attack"] += 5
                        hero_stats["defense"] += 3
                        hero_stats["speed"] += 2
                        hero_stats["max_qi"] += 10
                        hero_stats["qi"] = hero_stats["max_qi"]
                        inventory["items"].remove("beginner_pill")  # Удаляем пилюлю после использования
                        can_breakthrough = True
                        breakthrough_message = "Ты проглатываешь Пилюлю начала. Энергия наполняет твоё тело..."
                    else:
                        can_breakthrough = False
                        breakthrough_message = "Для первого прорыва необходима Пилюля начала. Возможно, её можно найти, тренируясь на манекене..."
                else:
                    # Для последующих прорывов показываем условия
                    can_breakthrough = True  # По умолчанию считаем, что прорыв возможен
                    conditions_text = ""
                    
                    if hero_stats["level"] == 2:  # Условия для прорыва на уровень 3
                        if hero_stats["qi"] < 20:
                            conditions_text += "Недостаточно Ци (нужно 20)\n"
                            can_breakthrough = False
                        if hero_stats["attack"] < 15:
                            conditions_text += "Недостаточно силы атаки (нужно 15)\n"
                            can_breakthrough = False
                    elif hero_stats["level"] == 3:  # Условия для прорыва на уровень 4
                        if hero_stats["qi"] < 30:
                            conditions_text += "Недостаточно Ци (нужно 30)\n"
                            can_breakthrough = False
                        if hero_stats["speed"] < 10:
                            conditions_text += "Недостаточно скорости (нужно 10)\n"
                            can_breakthrough = False
            
            if old_level == 1:
                "[breakthrough_message]"
                if can_breakthrough:
                    "Твоё понимание Дао углубляется!"
                    "🎊 Поздравляем! Ты достиг стадии [number_to_words(hero_stats['level'])]! 🎊"
                    "Характеристики улучшены:\nАтака +5\nЗащита +3\nСкорость +2\nМаксимальное Ци +10"
            else:
                if can_breakthrough:
                    python:
                        hero_stats["level"] += 1
                        hero_stats["exp"] = 0
                        hero_stats["exp_to_next_level"] = exp_requirements[hero_stats["level"]]
                        hero_stats["attack"] += 5
                        hero_stats["defense"] += 3
                        hero_stats["speed"] += 2
                        hero_stats["max_qi"] += 10
                        hero_stats["qi"] = hero_stats["max_qi"]
                    "Ты успешно преодолел все препятствия!"
                    "🎊 Поздравляем! Ты достиг стадии [number_to_words(hero_stats['level'])]! 🎊"
                    "Характеристики улучшены:\nАтака +5\nЗащита +3\nСкорость +2\nМаксимальное Ци +10"
                else:
                    "Для совершения прорыва необходимо выполнить следующие условия:"
                    "[conditions_text]"
            jump training_ground

        "Статистика развития 📊":
            "Стадия культивации: [number_to_words(hero_stats['level'])]\nАтака: [hero_stats['attack']]\nЗащита: [hero_stats['defense']]\nЦи: [hero_stats['qi']]/[hero_stats['max_qi']]\nСкорость: [hero_stats['speed']]\nОпыт: [hero_stats['exp']]/[hero_stats['exp_to_next_level']]"
            jump training_ground

        "Вернуться на карту 🗺️":
            call screen secta_sky_blades_map
            return

# Добавим стили для боевого интерфейса перед меткой battle
style battle_stats:
    xalign 0.5
    yalign 0.0
    spacing 10

style battle_text:
    size 24
    color "#FFFFFF"
    outlines [(2, "#000000", 0, 0)]

style battle_bar:
    xsize 300
    ysize 25

# Экран для отображения характеристик в бою
screen battle_stats(enemy):
    frame:
        style "battle_stats"
        vbox:
            # Характеристики героя
            frame:
                background Solid("#000000AA")
                padding (10, 10)
                vbox:
                    spacing 5
                    text "[hero_stats['name']]" style "battle_text"
                    hbox:
                        spacing 5
                        text "HP:" style "battle_text"
                        bar value hero_stats["health"] range hero_stats["max_health"]:
                            style "battle_bar"
                            left_bar Solid("#FF0000")
                            right_bar Solid("#800000")
                    hbox:
                        spacing 5
                        text "Ци:" style "battle_text"
                        bar value hero_stats["qi"] range hero_stats["max_qi"]:
                            style "battle_bar"
                            left_bar Solid("#0000FF")
                            right_bar Solid("#000080")

            # Характеристики противника
            frame:
                background Solid("#000000AA")
                padding (10, 10)
                vbox:
                    spacing 5
                    text "[enemy['name']]" style "battle_text"
                    hbox:
                        spacing 5
                        text "HP:" style "battle_text"
                        bar value enemy["health"] range enemy["max_health"]:
                            style "battle_bar"
                            left_bar Solid("#FF0000")
                            right_bar Solid("#800000")

# Обновим метку battle для использования нового экрана
label battle(enemy_name):
    scene bg training_ground with dissolve  # Добавляем фон для боя
    
    # Создаем глубокую копию и проверяем её
    $ enemy = copy.deepcopy(enemies[enemy_name])
    
    # Проверяем и восстанавливаем способности героя
    python:
        default_abilities = {
            "swift_strike": {
                "name": "Стремительный удар",
                "damage_mult": 1.5,
                "qi_cost": 2,
                "description": "Быстрый удар с увеличенной скоростью"
            },
            "power_strike": {
                "name": "Силовой удар",
                "damage_mult": 2.0,
                "qi_cost": 3,
                "description": "Мощный удар с концентрацией Ци"
            },
            "dragon_fang": {
                "name": "Клык дракона",
                "damage_mult": 2.5,
                "qi_cost": 4,
                "description": "Легендарная техника удара в стиле дракона"
            }
        }
        if "abilities" not in hero_stats or not hero_stats["abilities"]:
            hero_stats["abilities"] = copy.deepcopy(default_abilities)
    
    "Проверка копии противника:"
    "Имя: [enemy['name']]"
    "Здоровье: [enemy['health']]"
    python:
        if "abilities" in enemy:
            abilities_str = ", ".join(enemy["abilities"].keys())
            renpy.say("", f"Способности: {abilities_str}")
        else:
            renpy.say("", "ОШИБКА: У противника нет способностей!")
            # Попробуем исправить это
            enemy["abilities"] = enemies[enemy_name]["abilities"]
            if "abilities" in enemy:
                renpy.say("", "Способности восстановлены!")
    
    $ in_battle = True
    $ initial_qi = hero_stats["qi"]  # Сохраняем начальное значение Ци
    
    "Ты вступил в бой с [enemy['name']]!"
    show screen battle_stats(enemy)

    while in_battle:
        menu:
            "Атака ⚔️":
                $ damage = calculate_damage(hero_stats, enemy)
                $ enemy["health"] -= damage
                "Ты нанёс [damage] урона врагу!"
                if enemy["health"] <= 0:
                    "Ты победил [enemy['name']]!"
                    if enemy_name == "training_dummy" and hero_stats["level"] == 1 and "beginner_pill" not in inventory["items"]:
                        "В обломках манекена ты находишь Пилюлю начала! 💊"
                        $ add_item("beginner_pill")
                    $ hero_stats["qi"] = initial_qi
                    $ in_battle = False
                else:
                    call enemy_turn from _call_enemy_turn

            "Выбрать способность 🌟":
                menu:
                    "Стремительный удар (2 Ци) ⚡" if hero_stats["qi"] >= 2 and available_abilities["swift_strike"]["learned"]:
                        $ ability = hero_stats["abilities"]["swift_strike"]
                        $ hero_stats["qi"] -= 2
                        $ damage = calculate_damage(hero_stats, enemy) * ability["damage_mult"]
                        $ enemy["health"] -= damage
                        "[ability['description']]!"
                        "Ты нанёс [damage] урона!"
                        if enemy["health"] <= 0:
                            "Ты победил [enemy['name']]!"
                            $ hero_stats["qi"] = initial_qi
                            $ in_battle = False
                        else:
                            call enemy_turn from _call_enemy_turn_1

                    "Силовой удар (3 Ци) 💥" if hero_stats["qi"] >= 3 and available_abilities["power_strike"]["learned"]:
                        $ ability = hero_stats["abilities"]["power_strike"]
                        $ hero_stats["qi"] -= 3
                        $ damage = calculate_damage(hero_stats, enemy) * ability["damage_mult"]
                        $ enemy["health"] -= damage
                        "[ability['description']]!"
                        "Ты нанёс [damage] урона!"
                        if enemy["health"] <= 0:
                            "Ты победил [enemy['name']]!"
                            $ hero_stats["qi"] = initial_qi
                            $ in_battle = False
                        else:
                            call enemy_turn from _call_enemy_turn_2

                    "Клык дракона (4 Ци) 🐉" if hero_stats["qi"] >= 4 and available_abilities["dragon_fang"]["learned"]:
                        $ ability = hero_stats["abilities"]["dragon_fang"]
                        $ hero_stats["qi"] -= 4
                        $ damage = calculate_damage(hero_stats, enemy) * ability["damage_mult"]
                        $ enemy["health"] -= damage
                        "[ability['description']]!"
                        "Ты нанёс [damage] урона!"
                        if enemy["health"] <= 0:
                            "Ты победил [enemy['name']]!"
                            $ hero_stats["qi"] = initial_qi
                            $ in_battle = False
                        else:
                            call enemy_turn from _call_enemy_turn_3

                    "Вернуться":
                        pass

            "Бегство 🏃":
                "Ты сбежал."
                $ in_battle = False

    hide screen battle_stats
    # Восстанавливаем Ци после боя
    $ hero_stats["qi"] = initial_qi
    # Восстанавливаем здоровье противника
    $ enemy["health"] = enemy["max_health"]
    
    # Возвращаем фон тренировочной площадки
    scene bg training_ground with dissolve
    return

# Добавим метку для хода противника
label enemy_turn:
    # Противник выбирает действие
    if "abilities" in enemy and enemy["abilities"]:
        $ use_ability = renpy.random.choice([True, False])  # 50% шанс использования способности
        if use_ability:
            # Выбираем случайную способность
            $ ability = renpy.random.choice(list(enemy["abilities"].values()))
            $ enemy_damage = calculate_damage(enemy, hero_stats) * ability["damage_mult"]
            "[enemy['name']] [ability['description']]!"
            "Использует [ability['name']]!"
        else:
            $ enemy_damage = calculate_damage(enemy, hero_stats)
            "[enemy['name']] атакует!"
    else:
        $ enemy_damage = calculate_damage(enemy, hero_stats)
        "[enemy['name']] атакует!"
    
    $ hero_stats["health"] -= enemy_damage
    "Враг нанёс [enemy_damage] урона!"
    if hero_stats["health"] <= 0:
        "Ты проиграл бой!"
        hide screen battle_stats
        # Восстанавливаем Ци после поражения
        $ hero_stats["qi"] = initial_qi
        return
    return

# Добавим метку для изучения способностей
label learn_abilities:
    python:
        # Проверяем и создаём словарь способностей, если его нет
        if "abilities" not in hero_stats:
            hero_stats["abilities"] = {}
    
    "Ты открываешь свиток с техниками."
    
    menu:
        "Стремительный удар (Требования: [available_abilities['swift_strike']['requirements']['level']], Ци 5, Скорость 5)":
            if available_abilities["swift_strike"]["learned"]:
                "Ты уже изучил эту технику."
            elif (number_to_words(hero_stats["level"]) == available_abilities["swift_strike"]["requirements"]["level"] and
                  hero_stats["qi"] >= available_abilities["swift_strike"]["requirements"]["qi"] and
                  hero_stats["speed"] >= available_abilities["swift_strike"]["requirements"]["speed"]):
                "Ты успешно изучил технику [available_abilities['swift_strike']['name']]!"
                $ available_abilities["swift_strike"]["learned"] = True
                $ hero_stats["abilities"]["swift_strike"] = available_abilities["swift_strike"]
            else:
                "Ты пока не готов изучить эту технику. Тренируйся больше!"

        "Силовой удар (Требования: [available_abilities['power_strike']['requirements']['level']], Ци 8, Атака 12)":
            if available_abilities["power_strike"]["learned"]:
                "Ты уже изучил эту технику."
            elif (number_to_words(hero_stats["level"]) == available_abilities["power_strike"]["requirements"]["level"] and
                  hero_stats["qi"] >= available_abilities["power_strike"]["requirements"]["qi"] and
                  hero_stats["attack"] >= available_abilities["power_strike"]["requirements"]["attack"]):
                "Ты успешно изучил технику [available_abilities['power_strike']['name']]!"
                $ available_abilities["power_strike"]["learned"] = True
                $ hero_stats["abilities"]["power_strike"] = available_abilities["power_strike"]
            else:
                "Ты пока не готов изучить эту технику. Тренируйся больше!"

        "Клык дракона (Требования: [available_abilities['dragon_fang']['requirements']['level']], Ци 10, Атака 15, Скорость 8)":
            if available_abilities["dragon_fang"]["learned"]:
                "Ты уже изучил эту технику."
            elif (number_to_words(hero_stats["level"]) == available_abilities["dragon_fang"]["requirements"]["level"] and
                  hero_stats["qi"] >= available_abilities["dragon_fang"]["requirements"]["qi"] and
                  hero_stats["attack"] >= available_abilities["dragon_fang"]["requirements"]["attack"] and
                  hero_stats["speed"] >= available_abilities["dragon_fang"]["requirements"]["speed"]):
                "Ты успешно изучил технику [available_abilities['dragon_fang']['name']]!"
                $ available_abilities["dragon_fang"]["learned"] = True
                $ hero_stats["abilities"]["dragon_fang"] = available_abilities["dragon_fang"]
            else:
                "Ты пока не готов изучить эту технику. Тренируйся больше!"

        "Вернуться":
            return
    return


