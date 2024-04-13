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
                    const blockEntity = listEntities[j]
                    let moveToPosition = { x: 0, y: 0}
                    // if (blockEntity.type !== EntityType.BLOCK)
                    // {
                    //     continue
                    // }
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

                    if (blockEntity.type === EntityType.BLOCK && moveToPosition.x === blockEntity.normalizedX && moveToPosition.y === blockEntity.normalizedY)
                    {
                        if (blockEntity.callback !== undefined)
                        {
                            blockEntity.callback()
                        }
                        return
                    }
                    if (blockEntity.type === EntityType.ITEM && moveToPosition.x === blockEntity.normalizedX && moveToPosition.y === blockEntity.normalizedY)
                    {
                        if (blockEntity.callback !== undefined)
                        {
                            blockEntity.callback()
                        }
                        
                    }
                }
                entity.move(direction)
                        
            }
        }
    }
}