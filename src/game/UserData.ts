export class UserData
{
    static newGame: boolean = true;
    static potions: number = 0;
    static canMove: boolean = true;
    static equipment: number = 0;
    static spawnPointX: number = 0;
    static spawnPointY: number = 0;
    static stepsAdventure: number = 0;
    static isWrecnchPicked: boolean = false;
    static isGarlicPicked: any;
    static isPoisonPicked: any;
    static carRepaired: boolean = false;
    static manCured: boolean = false;

    static beatTheGame: boolean = false;

    static reset()
    {
        UserData.newGame = true;
        UserData.potions = 0;
        UserData.canMove = true;
        UserData.equipment = 0;
        UserData.spawnPointX = 0;
        UserData.spawnPointY = 0;
        UserData.stepsAdventure = 0;
        UserData.isWrecnchPicked = false;
        UserData.isGarlicPicked = false;
        UserData.isPoisonPicked = false;
        UserData.carRepaired = false;
        UserData.manCured = false;
    }

}
