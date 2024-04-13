import IEntity, { EntityType } from "./IEntity"

export default class PlayerController
{
    public static LEFT: number = 0
    public static RIGHT: number = 1
    public static UP: number = 2
    public static DOWN: number = 3

    public static movePlayer(listEntities: IEntity[], direction: number): void
    {
        for (let i = 0; i < listEntities.length; i++)
        {
            const entity = listEntities[i]
            if (entity.type == EntityType.PLAYER)
            {
                // Check blocks
                for (let j = 0; j < listEntities.length; j++)
                {
                    const checkEntity = listEntities[j]
                    let moveToPosition = { x: 0, y: 0}

                    switch(direction)
                    {
                        case PlayerController.LEFT:
                            moveToPosition = { x: entity.normalizedX - 8, y: entity.normalizedY }
                            break
                        case PlayerController.RIGHT:
                            moveToPosition = { x: entity.normalizedX + 8, y: entity.normalizedY }
                            break
                        case PlayerController.UP:
                            moveToPosition = { x: entity.normalizedX, y: entity.normalizedY - 8 }
                            break
                        case PlayerController.DOWN:
                            moveToPosition = { x: entity.normalizedX, y: entity.normalizedY + 8 }
                            break
                    }

                    if (checkEntity.type === EntityType.BLOCK && moveToPosition.x === checkEntity.normalizedX && moveToPosition.y === checkEntity.normalizedY)
                    {
                        if (checkEntity.callback !== undefined)
                        {
                            checkEntity.callback()
                        }
                        return
                    }

                    if (checkEntity.type === EntityType.ITEM && moveToPosition.x === checkEntity.normalizedX && moveToPosition.y === checkEntity.normalizedY)
                    {
                        if (checkEntity.callback !== undefined)
                        {
                            checkEntity.callback()
                        }
                    }
                }
                
                entity.move(direction)
                        
            }
        }
    }
}