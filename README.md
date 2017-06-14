# Unchated Waters: Web多人VR环境

Uncharted Waters 是一个web多人VR游戏，使用了express、vue、three.js、socket.io等技术。

Demo: <a>webpj.ruchenshanghai.cn</a>

## Communications

- 胡弋舟 15302010002@fudan.edu.cn
- 麻俊特 15302010022@fudan.edu.cn
- 文进 14307110274@fudan.edu.cn
- 吴豪奇 15302010016@fudan.edu.cn



## What is it?

Uncharted Waters 是一个Web多人VR社交游戏，玩家在注册后可以加入游戏。

在选择了船的模型之后，玩家可以进入游戏。
在游戏的主场景中，用户可以用 WASD 键控制船的移动，用F键控制船的开火。用户的主要游戏目的就是控制自己的船攻击别的用户的船，击沉后获取经验升级。

用户也可以通过内置的聊天界面和别的用户进行沟通交流。

同时，游戏场景里也有一些人工智能的NPC会对用户进行攻击，NPC分为两种，第一种不会移动，会对进入其攻击范围（500码）的玩家船只进行攻击；第二种会对进入其追踪范围（1000码）的玩家船只进行追踪，对进入其攻击范围（500码）的玩家船只进行攻击。

当然，由于我们的游戏的主要部分还是在玩家和玩家之间的对战，所以对于NPC的攻击玩家以躲避为主。

<img src="https://github.com/xianyinuma/totalProject/blob/master/photo/demo1.jpeg">

## Programe Architecture

- 项目组织：

前端：


 assets文件夹
  
      
    ./public/assets/
    ├── images
    ├── lib
    │   ├── bootstrap
    │   │   ├── css
    │   │   ├── fonts
    │   │   └── js
    │   └── js
    ├── models
    ├── texture
    
    images文件夹主要存储了需要用到的图片。
    lib文件夹存储了用到的three.js库和其他库。
    models文件夹存储了我们用到的模型。
    texture文件夹主要存储了天空盒子和水的材质。


css文件夹

    ./public/css/
    .
    ├── chatroom.css
    ├── index.css
    ├── login.css
    ├── register.css
    ├── reset.css
    ├── style.css
    └── welcome.css
    
    主要存储了自己写的CSS文件。
    
    
js文件夹

    .
    ├── loading.js
    ├── model
    │   ├── CreateModel.js
    │   ├── DDSLoader.js
    │   ├── MTLLoader.js
    │   ├── OBJLoader.js
    │   ├── OrbitControls.js
    │   └── WaterShader.js
    ├── sea-battle
    │   ├── Boat.js
    │   ├── Box.js
    │   ├── Bullet.js
    │   ├── GameManager.js
    │   ├── Map.js
    │   ├── MovableObject.js
    │   ├── NPC.js
    │   ├── Player.js
    │   ├── Portal.js
    │   ├── StaticObject.js
    │   ├── UnmovableNPC.js
    │   ├── chatroom.js
    │   └── loading
    │       ├── Bird.js
    │       ├── Boid.js
    │       ├── CanvasRenderer.js
    │       ├── Projector.js
    │       └── stats.min.js
    └── sea-battle.js
    
    主要储存了js文件。
    loading.js 加载动画
    ./model/CreateModel.js 加载模型
    
    ./sea-battle/Boat.js Boat类，船的移动、属性等
    ./sea-battle/Box.js Box类，补给箱
    ./sea-battle/Bullet.js Bullet类，子弹
    ./sea-battle/GameManager.js 游戏类，处理用户按键事件、组织游戏逻辑
    ./sea-battle/Map.js Map类，地图
    ./sea-battle/MovableObject.js 船的父类
    ./sea-battle/NPC.js NPC类，可移动追踪的NPC船的实现
    ./sea-battle/player.js 创建玩家
    ./sea-battle/Portal.js 传送门的实现
    ./sea-battle/staticObject.js 静态物品的父类
    ./sea-battle/UnmovableNPC.js 静止NPC的实现
    ./sea-battle/charoom.js 聊天室的实现
    ./sea-battle/loading/ 加载动画的实现
    
    ./sea-battle.js 主文件
    

- 关键功能实现细节

船的移动

    boat.controlBoat = {
        moveForward = false,
        moveBackward = false,
        moveLeft = false,
        moveRight = false
    };
    用上述四个flag控制船的移动，根据用户WASD的相关操作，将不同的flag设为true。
    在updateMoveModel()函数中根据上述的四个flag对船的当前移动（包括mesh.position 和 mesh.rotation进行计算）。
    
    
NPC的移动
    
    detect()函数,确定周围是否有玩家的船，有的话进行追踪或攻击。
    
    静态NPC：当有玩家靠近，lookAt玩家，并进行攻击。
    动态NPC：取两个向量，VecA是当前NPC船的方向向量，VecB是从NPC船的位置指向玩家船的位置的向量，计算两者外积之后，结果为正则左转，为负则右转。
    
    
船的同步

- 使用技术：Socket.io
- 同步细节：
    - **船**的同步：
        - 每个client拥有一条boat，client将自己boat的相关信息（移动速度、方向、等级血量信息）**定时**发送到server，再由server同步到所有client。同步的间隔为30ms。
        - 每个client对自己船的信息有着**绝对的控制权**，不被其他client所改变。一个client判断自己船的相关碰撞（与其他船、静态物品、子弹的碰撞），改变自己的信息，不干扰其他boat的信息。
    - **子弹**的同步：
        - 开炮：当一个boat开炮时，相应的client会触发socket.io的“Fire”事件，在将子弹的信息传到server，再由server同步给所有的client。
    - **静态物品（传送门与补给包）**的同步：
        - 初始静态物品读取：server向新加入的client发送静态物品数据，进行同步
        - 船与静态物品发生碰撞：client将相应碰撞到的静态物品的id发送给server，server将自己与所有client中的该物品删去
    - **NPC**的同步：完全由server控制，NPC在server中移动开火，**定时**将NPC的信息发送给所有的client，同步间隔为30ms。
    - **组队**的同步：由一client向另一特定的client发送请求信息，答应则，向所有的相关队友client发送新增队友信息，进行消息同步。

    
    

    


- 后端
    
    MVC框架：Express
    
    **Model**：models文件夹下存放服务器端实体，并且提供访问数据库的接口
    User提供save、updateMail、updateNick、get、updateRecord接口，分别对应对数据库中的增删改查等操作。
    
    **View**：视图层采用jade模板生成HTML代码
    主要包括以下jade模板文件：error, index, info, layout, log, main, reg, ship, welcome；
    分别对应不同功能的页面
    
    **Controller**：根据不同的http请求（get，post）设置对应路由
    /main 游戏主页面; /reg 注册页面; /log 登录页面; /info 玩家信息页面;
     /ship 选择船模型页面; /welcome 默认首页

    项目完成的比较仓促，但是我们尽量保持代码的整洁和可维护性，一些编码方式也借
    鉴当前流行的最佳实践。但理想是美好的，现实总是不会做到那么完美，需要不断的
    完善。目前存在的问题是后端代码结构不够清晰、整体代码中无用代码还没有来得及
    移除。

    **同步机制**：前端socket.io emit特定接口的事件，后端socket.io on接收对应接口事件。

    **生产环境发布**：pm2进程管理器 + MLab云MongoDB数据库



