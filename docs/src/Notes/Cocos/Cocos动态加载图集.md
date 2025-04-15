---
title: "Cocos动态加载图集"
outline: deep
desc: "Cocos动态加载图集"
tags: "Cocos"
updateTime: "2024-09-06"
---
> 以下方案尚未验证,只是一种想法

#### 动态加载图集方法
```js
import { ImageAsset, JsonAsset, rect, Rect, size, Size, SpriteAtlas, SpriteFrame, Texture2D } from 'cc';

async function loadPlist(plistAsset: JsonAsset, imageAsset: ImageAsset) {
    const texture = new Texture2D();
    const sa = new SpriteAtlas();
    texture.image = imageAsset;
    
    const frames = plistAsset._nativeAsset.frames;
    const sfs = sa.spriteFrames;
    const plistRegex = /[,{}\s]+/;
    const tmpRect = new Rect();
    const tmpSize = new Size();
    
    for (const key in frames) {
        const sf = new SpriteFrame();
        const frame = frames[key];
        sf.texture = texture;
        let tmp: string[] = frame.frame.split(plistRegex, 5);
        sf.rect = tmpRect.set(parseInt(tmp[1]), parseInt(tmp[2]), parseInt(tmp[3]), parseInt(tmp[4]));
        tmp = frame.offset.split(plistRegex, 3);
        sf.offset.set(parseInt(tmp[1]), parseInt(tmp[2]));
        tmp = frame.sourceSize.split(plistRegex, 3);
        sf.originalSize = tmpSize.set(parseInt(tmp[1]), parseInt(tmp[2]));
        sf.rotated = frame.rotated;
        sfs[key.slice(0, -4)] = sf;
    }
    
    return sa;
}

// 使用示例
async function example() {
    try {
        // 同时加载 plist 和图片资源
        const [plistAsset, imageAsset] = await Promise.all([
            new Promise<JsonAsset>((resolve, reject) => {
                resources.load('path/to/your/atlas.plist', JsonAsset, (err, asset) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(asset);
                });
            }),
            new Promise<ImageAsset>((resolve, reject) => {
                resources.load('path/to/your/atlas.png', ImageAsset, (err, asset) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(asset);
                });
            })
        ]);

        // 创建图集
        const atlas = await loadPlist(plistAsset, imageAsset);
        
        // 使用图集中的精灵帧
        const sprite = this.getComponent(Sprite);
        if (sprite) {
            sprite.spriteFrame = atlas.getSpriteFrame('spriteName');
        }
    } catch (error) {
        console.error('Error loading assets:', error);
    }
}
```
#### 动态变更预置体的图集
```js
import { ImageAsset, JsonAsset, Sprite, Prefab, instantiate, Node } from 'cc';

// ... 前面的 loadPlist 方法保持不变 ...

class DynamicAtlasManager {
    private atlas: SpriteAtlas | null = null;

    // 加载图集
    async loadAtlas(plistPath: string, imagePath: string) {
        try {
            const [plistAsset, imageAsset] = await Promise.all([
                new Promise<JsonAsset>((resolve, reject) => {
                    resources.load(plistPath, JsonAsset, (err, asset) => {
                        err ? reject(err) : resolve(asset);
                    });
                }),
                new Promise<ImageAsset>((resolve, reject) => {
                    resources.load(imagePath, ImageAsset, (err, asset) => {
                        err ? reject(err) : resolve(asset);
                    });
                })
            ]);

            this.atlas = await loadPlist(plistAsset, imageAsset);
            return this.atlas;
        } catch (error) {
            console.error('加载图集失败:', error);
            return null;
        }
    }

    // 更新预制体中的精灵
    updatePrefabSprites(prefab: Prefab, spriteMapping: Record<string, string>) {
        if (!this.atlas) {
            console.warn('图集未加载，请先加载图集');
            return null;
        }

        const node = instantiate(prefab);
        
        // 获取所有需要更新的精灵组件
        const sprites = node.getComponentsInChildren(Sprite);
        
        sprites.forEach(sprite => {
            const nodeName = sprite.node.name;
            if (spriteMapping[nodeName]) {
                const newFrame = this.atlas.getSpriteFrame(spriteMapping[nodeName]);
                if (newFrame) {
                    sprite.spriteFrame = newFrame;
                }
            }
        });

        return node;
    }
}

// 使用示例
async function example() {
    const atlasManager = new DynamicAtlasManager();
    
    // 1. 加载图集
    await atlasManager.loadAtlas('path/to/your/atlas.plist', 'path/to/your/atlas.png');
    
    // 2. 加载预制体
    const prefab = await new Promise<Prefab>((resolve, reject) => {
        resources.load('prefabs/yourPrefab', Prefab, (err, prefab) => {
            err ? reject(err) : resolve(prefab);
        });
    });

    // 3. 定义节点名称和对应的精灵帧名称映射
    const spriteMapping = {
        'playerNode': 'player_sprite',
        'weaponNode': 'weapon_sprite',
        // ... 更多映射
    };

    // 4. 更新预制体中的精灵并实例化
    const updatedNode = atlasManager.updatePrefabSprites(prefab, spriteMapping);
    if (updatedNode) {
        // 将节点添加到场景中
        this.node.addChild(updatedNode);
    }
}
```

#### 参考链接
1. [Cocos动态加载图集](https://forum.cocos.org/t/topic/154888)