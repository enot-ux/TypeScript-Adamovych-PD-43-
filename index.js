class Player {
    name: string;
    health: number;
    attackPower: number;
    level: number;
    alive: boolean;
    items: Item[];

    constructor(name: string) {
        this.name = name;
        this.health = 100;
        this.attackPower = 10;
        this.level = 1;
        this.alive = true;
        this.items = [];
    }

    attack(target: Monster): void {
        if (this.alive && target.alive) {
            console.log(`${this.name} атакує ${target.name} на ${this.attackPower} очок пошкоджень.`);
            target.takeDamage(this.attackPower);
            this.gainExperience(10);
        } else {
            console.log(`${this.name} або ${target.name} мертві і не можуть атакувати.`);
        }
    }

    takeDamage(amount: number): void {
        this.health -= amount;
        console.log(`${this.name} отримав ${amount} пошкоджень. Здоров'я: ${this.health}`);
        
        if (this.health <= 0) {
            this.health = 0;
            this.alive = false;
            console.log(`${this.name} мертвий.`);
        }
    }

    heal(amount: number): void {
        if (this.alive) {
            this.health += amount;
            console.log(`${this.name} вилікувався на ${amount} очок здоров'я. Здоров'я: ${this.health}`);
        } else {
            console.log(`${this.name} мертвий і не може бути вилікуваний.`);
        }
    }

    gainExperience(amount: number): void {
        console.log(`${this.name} отримав ${amount} досвіду.`);
        if (this.level < 5) {
            if (amount >= this.level * 20) {
                this.levelUp();
            }
        }
    }

    levelUp(): void {
        this.level += 1;
        this.attackPower += 5;
        this.health += 20;
        console.log(`${this.name} підвищив рівень! Новий рівень: ${this.level}, сила атаки: ${this.attackPower}, здоров'я: ${this.health}`);
    }

    useItem(item: Item): void {
        if (this.items.includes(item)) {
            console.log(`${this.name} використовує ${item.name}.`);
            item.use(this);
            this.items = this.items.filter(i => i !== item);
        } else {
            console.log(`${this.name} не має ${item.name}.`);
        }
    }

    addItem(item: Item): void {
        this.items.push(item);
        console.log(`${this.name} отримав предмет: ${item.name}.`);
    }
}

class Monster {
    name: string;
    health: number;
    attackPower: number;
    level: number;
    alive: boolean;

    constructor(name: string, level: number = 1) {
        this.name = name;
        this.health = level * 50;
        this.attackPower = level * 5;
        this.level = level;
        this.alive = true;
    }

    attack(target: Player): void {
        if (this.alive && target.alive) {
            console.log(`${this.name} атакує ${target.name} на ${this.attackPower} очок пошкоджень.`);
            target.takeDamage(this.attackPower);
        } else {
            console.log(`${this.name} або ${target.name} мертві і не можуть атакувати.`);
        }
    }

    takeDamage(amount: number): void {
        this.health -= amount;
        console.log(`${this.name} отримав ${amount} пошкоджень. Здоров'я: ${this.health}`);

        if (this.health <= 0) {
            this.health = 0;
            this.alive = false;
            console.log(`${this.name} мертвий.`);
        }
    }
}

class Item {
    name: string;
    effect: (target: Player) => void;

    constructor(name: string, effect: (target: Player) => void) {
        this.name = name;
        this.effect = effect;
    }

    use(target: Player): void {
        console.log(`${target.name} використовує ${this.name}.`);
        this.effect(target);
    }
}

class Game {
    players: Player[];
    monsters: Monster[];
    turnCount: number;

    constructor() {
        this.players = [];
        this.monsters = [];
        this.turnCount = 0;
    }

    addPlayer(player: Player): void {
        this.players.push(player);
        console.log(`${player.name} приєднався до гри.`);
    }

    addMonster(monster: Monster): void {
        this.monsters.push(monster);
        console.log(`${monster.name} з'явився у грі.`);
    }

    start(): void {
        console.log("Гра розпочалася!");
        while (this.players.some(p => p.alive) && this.monsters.some(m => m.alive)) {
            this.turn();
        }
        console.log("Гра завершена.");
    }

    turn(): void {
        this.turnCount++;
        console.log(`Хід ${this.turnCount}`);

        this.players.forEach(player => {
            if (player.alive) {
                const target = this.monsters.find(m => m.alive);
                if (target) {
                    player.attack(target);
                }
            }
        });

        this.monsters.forEach(monster => {
            if (monster.alive) {
                const target = this.players.find(p => p.alive);
                if (target) {
                    monster.attack(target);
                }
            }
        });

        console.log("Кінець ходу.\n");
    }
}

const healingPotion = new Item("Зілля Лікування", (target: Player) => target.heal(30));
const strengthPotion = new Item("Зілля Сили", (target: Player) => {
    target.attackPower += 5;
    console.log(`${target.name} отримав +5 до сили атаки.`);
});

const player1 = new Player("Гравець 1");
const player2 = new Player("Гравець 2");
const monster1 = new Monster("Монстр 1", 2);
const monster2 = new Monster("Монстр 2", 3);

player1.addItem(healingPotion);
player2.addItem(strengthPotion);

const game = new Game();
game.addPlayer(player1);
game.addPlayer(player2);
game.addMonster(monster1);
game.addMonster(monster2);

player1.useItem(healingPotion);

game.start();
