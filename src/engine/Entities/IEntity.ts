export const enum EntityType { PLAYER, ITEM, BLOCK, TILE }

export default interface IEntity
{
    type: EntityType;
    normalizedX: number;
    normalizedY: number;
    callback?: () => void;

    move(direction: number): void;
    update(delta: number): void;
}