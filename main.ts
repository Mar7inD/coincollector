enum ActionKind {
    Walking,
    Idle,
    Jumping,
    WalkingRight1,
    WalkingLeft1,
    Idle1,
    WalkingRight2,
    WalkingLeft2,
    Idle2,
    FloatingCoin,
    Bee,
    Bee1,
    Hearth
}
namespace SpriteKind {
    export const Coin = SpriteKind.create()
    export const ItemDoubleJump = SpriteKind.create()
    export const Live = SpriteKind.create()
    export const Final = SpriteKind.create()
}
function DoubleJumpMechanics () {
    if (LevelMap >= 4) {
        if (Hero1.isHittingTile(CollisionDirection.Left) || Hero1.isHittingTile(CollisionDirection.Right)) {
            DoubleJump1Timeout = 1
        }
        if (Hero2Active == 1) {
            if (Hero2.isHittingTile(CollisionDirection.Left) || Hero2.isHittingTile(CollisionDirection.Right)) {
                DoubleJump2Timeout = 1
            }
        }
    }
    if (DoubleJump1Timeout == 2 && Hero1.isHittingTile(CollisionDirection.Bottom)) {
        DoubleJump1Timeout = 0
    }
    if (Hero2Active == 1) {
        if (DoubleJump2Timeout == 2 && Hero2.isHittingTile(CollisionDirection.Bottom)) {
            DoubleJump2Timeout = 0
        }
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Final, function (sprite, otherSprite) {
    if (Score == 62) {
        game.over(true, effects.confetti)
    }
})
function Coin2 () {
    Coin = sprites.create(assets.image`CoinUp`, SpriteKind.Coin)
    AnCoin = animation.createAnimation(ActionKind.FloatingCoin, 200)
    AnCoin.addAnimationFrame(assets.image`Coin`)
    AnCoin.addAnimationFrame(assets.image`CoinUp`)
    AnCoin.addAnimationFrame(assets.image`Coin`)
    AnCoin.addAnimationFrame(assets.image`CoinDown`)
    animation.attachAnimation(Coin, AnCoin)
    animation.setAction(Coin, ActionKind.FloatingCoin)
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (DoubleJump == 0 && Hero1.isHittingTile(CollisionDirection.Bottom)) {
        Hero1.vy += -165
    } else if (DoubleJump == 1 && DoubleJump1Timeout < 2) {
        Hero1.vy += -165
        DoubleJump1Timeout += 1
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Coin, function (sprite, otherSprite) {
    Score += 1
    otherSprite.destroy()
})
function Bee () {
    EnemyBee = sprites.create(assets.image`BeeLeft`, SpriteKind.Enemy)
    AnBee = animation.createAnimation(ActionKind.Bee, 200)
    AnBee.addAnimationFrame(assets.image`Bee`)
    AnBee.addAnimationFrame(assets.image`Bee1`)
    animation.attachAnimation(EnemyBee, AnBee)
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`RespawnTile`, function (sprite, location) {
    info.startCountdown(90)
    Hero1.destroy()
    if (Hero2Active == 1) {
        Hero2.destroy()
    }
    if (Hero2Active == 0) {
        info.setLife(3)
    } else if (Hero2Active == 1) {
        info.setLife(6)
    }
    tiles.setTilemap(tilemap`LastMap`)
    Lives = 0
    Score = 36
    Respawn()
    scene.cameraFollowSprite(Hero1)
    if (Hero2Active == 1) {
        Hero2.setPosition(Hero1.x, Hero1.y)
    }
    CoinSpawner()
    GrandPa()
})
function Hero2Appearance () {
    Hero2 = sprites.create(assets.image`Hero2`, SpriteKind.Player)
    controller.player2.moveSprite(Hero2, 100, 0)
    if (LevelMap < 4) {
        Hero2.ay = 350
    }
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!(Dashing1) && DashActivate == 1) {
        Dashing1 = true
        LastVelocity1 = Hero1.vx
        controller.moveSprite(Hero1, 0, 0)
        if (Right1 == 1) {
            Direction1 = 1
        } else if (Left1 == 1) {
            Direction1 = -1
        }
        Hero1.setVelocity(Direction1 * 800, 0)
        for (let index = 0; index <= 3; index++) {
            projectile1 = sprites.createProjectileFromSprite(Hero1.image, Hero1, 0 - Direction1 * 5, 0)
            pause(5)
            projectile1.destroy()
            pause(5)
            projectile1.destroy()
            pause(5)
            projectile1.destroy()
            pause(5)
            projectile1.destroy()
            pause(20)
        }
        Hero1.vx = LastVelocity1
        controller.moveSprite(Hero1, 100, 0)
        Direction1 = 0
        Dashing1 = false
    }
})
controller.player2.onButtonEvent(ControllerButton.A, ControllerButtonEvent.Pressed, function () {
    if (!(Dashing2) && DashActivate == 1) {
        Dashing2 = true
        LastVelocity2 = Hero2.vx
        controller.player2.moveSprite(Hero2, 0, 0)
        if (Right2 == 1) {
            Direction2 = 1
        } else if (Left2 == 1) {
            Direction2 = -1
        }
        Hero2.setVelocity(Direction2 * 800, 0)
        for (let index = 0; index <= 3; index++) {
            projectile2 = sprites.createProjectileFromSprite(Hero2.image, Hero2, 0 - Direction2 * 5, 0)
            pause(5)
            projectile2.destroy()
            pause(5)
            projectile2.destroy()
            pause(5)
            projectile2.destroy()
            pause(5)
            projectile2.destroy()
            pause(20)
        }
        Hero2.vx = LastVelocity2
        controller.player2.moveSprite(Hero2, 100, 0)
        Direction2 = 0
        Dashing2 = false
    }
})
controller.combos.attachCombo("BABA", function () {
    if (Hero2Active == 0 && DisableMulti == 0) {
        Hero2Appearance()
        Hero2Animation()
        Hero2.setPosition(Hero1.x, Hero1.y)
        Hero2Active = 1
        info.changeLifeBy(HeartsRemain2Hero)
    } else if (Hero2Active == 1 && DisableMulti == 0) {
        Hero2.destroy()
        Hero2Active = 0
        info.changeLifeBy(0 - HeartsRemain2Hero)
    }
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    Left1 = 1
})
controller.player2.onButtonEvent(ControllerButton.Left, ControllerButtonEvent.Released, function () {
    if (Hero2Active == 1) {
        Left2 = 0
        Hero2.ay = 350
    }
})
controller.right.onEvent(ControllerButtonEvent.Released, function () {
    Right1 = 0
    Hero1.ay = 350
})
controller.left.onEvent(ControllerButtonEvent.Released, function () {
    Left1 = 0
    Hero1.ay = 350
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`Portal`, function (sprite, location) {
    if (Score == 10 && LevelMap == 1) {
        Hero1.destroy()
        if (Hero2Active == 1) {
            Hero2.destroy()
            if (Hero1Dead == 1) {
                info.changeLifeBy(3)
            } else if (Hero2Dead == 1) {
                info.changeLifeBy(3)
            }
        }
        tiles.setTilemap(tilemap`level2`)
        Lives = 0
        LevelMap += 1
        Respawn()
        scene.cameraFollowSprite(Hero1)
        if (Hero2Active == 1) {
            Hero2.setPosition(Hero1.x, Hero1.y)
        }
        DoubleJump = 1
        CoinSpawner()
    } else if (Score == 25 && LevelMap == 2) {
        Hero1.destroy()
        if (Hero2Active == 1) {
            Hero2.destroy()
        }
        if (Hero1Dead == 1) {
            info.changeLifeBy(3)
        } else if (Hero2Dead == 1) {
            info.changeLifeBy(3)
        }
        tiles.setTilemap(tilemap`level3`)
        Lives = 0
        LevelMap += 1
        DashActivate = 1
        Respawn()
        scene.cameraFollowSprite(Hero1)
        if (Hero2Active == 1) {
            Hero2.setPosition(Hero1.x, Hero1.y)
        }
        CoinSpawner()
    } else if (Score == 30 && LevelMap == 3) {
        Hero1.destroy()
        if (Hero2Active > 1) {
            Hero2.destroy()
        }
        if (Hero2Active == 1) {
            Hero2.destroy()
        }
        if (Hero1Dead == 1) {
            info.changeLifeBy(3)
        } else if (Hero2Dead == 1) {
            info.changeLifeBy(3)
        }
        tiles.setTilemap(tilemap`level4`)
        Lives = 0
        LevelMap += 1
        DashActivate = 1
        Respawn()
        scene.cameraFollowSprite(Hero1)
        if (Hero2Active == 1) {
            Hero2.setPosition(Hero1.x, Hero1.y)
        }
        CoinSpawner()
    } else if (Score == 36 && LevelMap == 4) {
        info.startCountdown(90)
        Hero1.destroy()
        if (Hero2Active == 1) {
            Hero2.destroy()
        }
        if (Hero1Dead == 1) {
            info.changeLifeBy(3)
        } else if (Hero2Dead == 1) {
            info.changeLifeBy(3)
        }
        tiles.setTilemap(tilemap`LastMap`)
        Lives = 0
        LevelMap += 1
        Respawn()
        scene.cameraFollowSprite(Hero1)
        if (Hero2Active == 1) {
            Hero2.setPosition(Hero1.x, Hero1.y)
        }
        CoinSpawner()
        GrandPa()
    }
})
info.onCountdownEnd(function () {
    info.startCountdown(90)
    Hero1.destroy()
    if (Hero2Active == 1) {
        Hero2.destroy()
    }
    if (Hero2Active == 0) {
        info.setLife(3)
    } else if (Hero2Active == 1) {
        info.setLife(6)
    }
    tiles.setTilemap(tilemap`LastMap`)
    Lives = 0
    Score = 36
    Respawn()
    scene.cameraFollowSprite(Hero1)
    if (Hero2Active == 1) {
        Hero2.setPosition(Hero1.x, Hero1.y)
    }
    CoinSpawner()
    GrandPa()
})
function Respawn () {
    Hero1Appearance()
    Hero1Animation()
    Hero1Dead = 0
    DisableMulti = 0
    HeartsRemain2Hero = 3
    if (Hero2Active == 1) {
        Hero2Appearance()
        Hero2Animation()
        Hero2Dead = 0
    }
}
function Hero1Animation () {
    AnRight1 = animation.createAnimation(ActionKind.WalkingRight1, 200)
    AnRight1.addAnimationFrame(assets.image`Hero1Right`)
    AnRight1.addAnimationFrame(assets.image`Hero1Right1`)
    AnRight1.addAnimationFrame(assets.image`Hero1Right`)
    AnRight1.addAnimationFrame(assets.image`Hero1Right2`)
    animation.attachAnimation(Hero1, AnRight1)
    AnLeft1 = animation.createAnimation(ActionKind.WalkingLeft1, 200)
    AnLeft1.addAnimationFrame(assets.image`Hero1Left`)
    AnLeft1.addAnimationFrame(assets.image`Hero1Left1`)
    AnLeft1.addAnimationFrame(assets.image`Hero1Left`)
    AnLeft1.addAnimationFrame(assets.image`Hero1Left2`)
    animation.attachAnimation(Hero1, AnLeft1)
    Idle1 = animation.createAnimation(ActionKind.Idle1, 200)
    Idle1.addAnimationFrame(assets.image`Hero1`)
    animation.attachAnimation(Hero1, Idle1)
}
controller.player2.onButtonEvent(ControllerButton.Up, ControllerButtonEvent.Pressed, function () {
    if (Hero2Active == 1) {
        if (DoubleJump == 0 && Hero2.isHittingTile(CollisionDirection.Bottom)) {
            Hero2.vy += -165
        } else if (DoubleJump == 1 && DoubleJump2Timeout < 2) {
            Hero2.vy += -165
            DoubleJump2Timeout += 1
        }
    }
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    Right1 = 1
})
controller.player2.onButtonEvent(ControllerButton.Right, ControllerButtonEvent.Pressed, function () {
    if (Hero2Active == 1) {
        Right2 = 1
    }
})
function Hero2Animation () {
    AnRight2 = animation.createAnimation(ActionKind.WalkingRight2, 200)
    AnRight2.addAnimationFrame(assets.image`Hero2Right`)
    AnRight2.addAnimationFrame(assets.image`Hero2Right1`)
    AnRight2.addAnimationFrame(assets.image`Hero2Right`)
    AnRight2.addAnimationFrame(assets.image`Hero2Right2`)
    animation.attachAnimation(Hero2, AnRight2)
    AnLeft2 = animation.createAnimation(ActionKind.WalkingLeft2, 200)
    AnLeft2.addAnimationFrame(assets.image`Hero2Left`)
    AnLeft2.addAnimationFrame(assets.image`Hero2Left1`)
    AnLeft2.addAnimationFrame(assets.image`Hero2Left`)
    AnLeft2.addAnimationFrame(assets.image`Hero1Left4`)
    animation.attachAnimation(Hero2, AnLeft2)
    Idle2 = animation.createAnimation(ActionKind.Idle2, 200)
    Idle2.addAnimationFrame(assets.image`Hero2`)
    animation.attachAnimation(Hero2, Idle2)
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Live, function (sprite, otherSprite) {
    if (Hero2Active == 1) {
        if (info.life() < 6) {
            if (Hero1Dead == 0 && Hero2Dead == 0) {
                info.changeLifeBy(1)
                otherSprite.destroy()
                if (sprite == Hero2) {
                    HeartsRemain2Hero += 1
                }
            } else if (Hero2Dead == 1 && info.life() < 3) {
                if (HeartsRemain2Hero == 0) {
                    info.changeLifeBy(1)
                    otherSprite.destroy()
                }
            } else if (Hero1Dead == 1 && info.life() < 3) {
                if (HeartsRemain2Hero == 0) {
                    info.changeLifeBy(1)
                    otherSprite.destroy()
                }
                info.changeLifeBy(1)
                HeartsRemain2Hero += 1
                otherSprite.destroy()
            }
        }
    } else if (Hero2Active == 0) {
        if (info.life() < 3) {
            info.changeLifeBy(1)
            otherSprite.destroy()
        }
    }
})
function Hero1Appearance () {
    Hero1 = sprites.create(assets.image`Hero1`, SpriteKind.Player)
    controller.moveSprite(Hero1, 100, 0)
    for (let value of tiles.getTilesByType(assets.tile`Spawn`)) {
        tiles.placeOnTile(Hero1, value)
        tiles.setTileAt(value, assets.tile`transparency16`)
    }
    if (LevelMap < 4) {
        Hero1.ay = 350
    }
}
function Hearth2 () {
    Hearth = sprites.create(assets.image`Heart`, SpriteKind.Live)
    AnHearth = animation.createAnimation(ActionKind.Hearth, 200)
    AnHearth.addAnimationFrame(assets.image`Heart`)
    AnHearth.addAnimationFrame(assets.image`Heart1`)
    AnHearth.addAnimationFrame(assets.image`Heart`)
    AnHearth.addAnimationFrame(assets.image`Heart2`)
    animation.attachAnimation(Hearth, AnHearth)
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`Fire`, function (sprite, location) {
    sprite.destroy()
    Lives += 1
    if (sprite == Hero1 && Hero1Dead == 0) {
        scene.cameraFollowSprite(Hero2)
        Hero1Dead = 1
        info.changeLifeBy(-3)
    } else if (sprite == Hero2 && Hero2Dead == 0) {
        scene.cameraFollowSprite(Hero1)
        Hero2Dead = 1
        DisableMulti = 1
        info.changeLifeBy(-3)
        HeartsRemain2Hero = 0
    }
    if (Hero2Active == 0) {
        if (Lives == 1) {
            game.over(false)
        }
    } else if (Hero2Active == 1) {
        if (Lives == 3) {
            game.over(false)
        }
    }
})
info.onLifeZero(function () {
    if (LevelMap == 5) {
        info.startCountdown(90)
        Hero1.destroy()
        if (Hero2Active == 1) {
            Hero2.destroy()
        }
        if (Hero2Active == 0) {
            info.setLife(3)
        } else if (Hero2Active == 1) {
            info.setLife(6)
        }
        tiles.setTilemap(tilemap`LastMap`)
        Lives = 0
        Score = 36
        Respawn()
        scene.cameraFollowSprite(Hero1)
        if (Hero2Active == 1) {
            Hero2.setPosition(Hero1.x, Hero1.y)
        }
        CoinSpawner()
        GrandPa()
    } else if (LevelMap < 5) {
        game.over(false)
    }
})
function MovementChecker () {
    if (Right1 == 1) {
        animation.setAction(Hero1, ActionKind.WalkingRight1)
    } else if (Left1 == 1) {
        animation.setAction(Hero1, ActionKind.WalkingLeft1)
    } else if (Left1 == 0 && Right1 == 0) {
        animation.setAction(Hero1, ActionKind.Idle1)
    }
    if (Hero2Active == 1) {
        if (Right2 == 1) {
            animation.setAction(Hero2, ActionKind.WalkingRight2)
        } else if (Left2 == 1) {
            animation.setAction(Hero2, ActionKind.WalkingLeft2)
        } else if (Right2 == 0 && Left2 == 0) {
            animation.setAction(Hero2, ActionKind.Idle2)
        }
    }
    if (LevelMap >= 4 && (Left1 == 1 && Hero1.isHittingTile(CollisionDirection.Left))) {
        animation.stopAnimation(animation.AnimationTypes.All, Hero1)
        Hero1.setImage(assets.image`Hero1LeftCatch`)
    } else if (LevelMap >= 4 && (Hero1.isHittingTile(CollisionDirection.Right) && Right1 == 1)) {
        animation.stopAnimation(animation.AnimationTypes.All, Hero1)
        Hero1.setImage(assets.image`Hero1RightCatch`)
    }
    if (Hero2Active == 1) {
        if (LevelMap >= 4 && (Hero2.isHittingTile(CollisionDirection.Left) && Left2 == 1)) {
            animation.stopAnimation(animation.AnimationTypes.All, Hero2)
            Hero2.setImage(assets.image`Hero2LeftCatch`)
        } else if (LevelMap >= 4 && (Hero2.isHittingTile(CollisionDirection.Right) && Right2 == 1)) {
            animation.stopAnimation(animation.AnimationTypes.All, Hero2)
            Hero2.setImage(assets.image`Hero2RightCatch`)
        }
    }
}
controller.player2.onButtonEvent(ControllerButton.Left, ControllerButtonEvent.Pressed, function () {
    if (Hero2Active == 1) {
        Left2 = 1
    }
})
function CoinSpawner () {
    for (let value of sprites.allOfKind(SpriteKind.Coin)) {
        value.destroy()
    }
    for (let value of sprites.allOfKind(SpriteKind.Live)) {
        value.destroy()
    }
    for (let value of sprites.allOfKind(SpriteKind.Enemy)) {
        value.destroy()
    }
    for (let value of tiles.getTilesByType(assets.tile`CoinSpawner`)) {
        Coin2()
        tiles.placeOnTile(Coin, value)
        tiles.setTileAt(value, assets.tile`transparency16`)
    }
    for (let value of tiles.getTilesByType(assets.tile`Danger`)) {
        Bee()
        tiles.placeOnTile(EnemyBee, value)
        tiles.setTileAt(value, assets.tile`transparency16`)
        animation.runMovementAnimation(
        EnemyBee,
        "c -100 0 100 0 0 0",
        5000,
        true
        )
        animation.setAction(EnemyBee, ActionKind.Bee)
    }
    for (let value of tiles.getTilesByType(assets.tile`BeeSpawnerY`)) {
        Bee()
        tiles.placeOnTile(EnemyBee, value)
        tiles.setTileAt(value, assets.tile`transparency16`)
        animation.runMovementAnimation(
        EnemyBee,
        "c 0 -100 0 100 0 0",
        5000,
        true
        )
        animation.setAction(EnemyBee, ActionKind.Bee)
    }
    for (let value of tiles.getTilesByType(assets.tile`HearthSpawn`)) {
        Hearth2()
        tiles.placeOnTile(Hearth, value)
        tiles.setTileAt(value, assets.tile`transparency16`)
        animation.setAction(Hearth, ActionKind.Hearth)
    }
}
function GrandPa () {
    for (let value of tiles.getTilesByType(assets.tile`GrandPa`)) {
        FinalPerson = sprites.create(assets.image`GrandPa`, SpriteKind.Final)
        tiles.placeOnTile(FinalPerson, value)
        tiles.setTileAt(value, assets.tile`transparency16`)
    }
}
controller.player2.onButtonEvent(ControllerButton.Right, ControllerButtonEvent.Released, function () {
    if (Hero2Active == 1) {
        Right2 = 0
        Hero2.ay = 350
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    if (sprite.y >= otherSprite.y) {
        info.changeLifeBy(-1)
        otherSprite.destroy()
        if (sprite == Hero2) {
            HeartsRemain2Hero += -1
        }
    } else if (sprite.y < otherSprite.y) {
        otherSprite.destroy(effects.fire, 500)
    }
})
let FinalPerson: Sprite = null
let AnHearth: animation.Animation = null
let Hearth: Sprite = null
let Idle2: animation.Animation = null
let AnLeft2: animation.Animation = null
let AnRight2: animation.Animation = null
let Idle1: animation.Animation = null
let AnLeft1: animation.Animation = null
let AnRight1: animation.Animation = null
let Hero2Dead = 0
let Hero1Dead = 0
let DisableMulti = 0
let projectile2: Sprite = null
let Direction2 = 0
let Left2 = 0
let Right2 = 0
let LastVelocity2 = 0
let Dashing2 = false
let projectile1: Sprite = null
let Direction1 = 0
let Left1 = 0
let Right1 = 0
let LastVelocity1 = 0
let DashActivate = 0
let Dashing1 = false
let AnBee: animation.Animation = null
let EnemyBee: Sprite = null
let DoubleJump = 0
let AnCoin: animation.Animation = null
let Coin: Sprite = null
let Score = 0
let DoubleJump2Timeout = 0
let Hero2: Sprite = null
let Hero2Active = 0
let DoubleJump1Timeout = 0
let HeartsRemain2Hero = 0
let LevelMap = 0
let Lives = 0
let Hero1: Sprite = null
scene.setBackgroundImage(assets.image`Background`)
tiles.setTilemap(tilemap`level1`)
Hero1Appearance()
Hero1Animation()
scene.cameraFollowSprite(Hero1)
Lives = 0
LevelMap = 1
CoinSpawner()
info.setLife(3)
HeartsRemain2Hero = 3
game.onUpdate(function () {
    if (LevelMap >= 4) {
        if ((Hero1.isHittingTile(CollisionDirection.Left) || Hero1.isHittingTile(CollisionDirection.Right)) && Hero1.vy >= 0) {
            Hero1.vy = 0
            Hero1.ay = 0
        } else {
            Hero1.ay = 350
        }
        if (Hero1.vy <= -165 && (Hero1.isHittingTile(CollisionDirection.Left) || Hero1.isHittingTile(CollisionDirection.Right))) {
            Hero1.vy = -165
        }
        if (Hero2Active == 1) {
            if ((Hero2.isHittingTile(CollisionDirection.Left) || Hero2.isHittingTile(CollisionDirection.Right)) && Hero2.vy >= 0) {
                Hero2.vy = 0
                Hero2.ay = 0
            } else {
                Hero2.ay = 350
            }
            if (Hero2.vy <= -165 && (Hero2.isHittingTile(CollisionDirection.Left) || Hero2.isHittingTile(CollisionDirection.Right))) {
                Hero2.vy = -165
            }
        }
    }
})
forever(function () {
    MovementChecker()
    DoubleJumpMechanics()
})
