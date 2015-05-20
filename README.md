詳細は、[はじめてのTypeScript開発環境構築（gulp, bower, webpack, tsd, npm） | Black Everyday Company](http://kuroeveryday.blogspot.jp/2015/05/typescript-development.html)を参照。  
以下はをブログを書くときにつかった下書き。


はじめてのTypeScript開発環境構築（gulp, bower, webpack, tsd, npm）
========================================

TypeScriptで開発しようとしたとき、いろんな問題がぶつかった。  
もともとSIerではVisual Studioさえあればなんとかなる環境で育ってきたため、Web系のさまざまなツールを導入する上で何度も挫折した。

ということで、初心者（私）が初心者向けに「はじめてTypeScriptの開発環境（gulp + bower + webpack + tsd + npm）を構築するときの手順とポイント」についてまとめていこうと思う。  

ツールの使い方間違っているよなどの指摘がありましたら、コメントやTwitterで教えてください。


### この記事の目標
* TypeScriptで開発したい
* ライブラリも使いたい（今回はjQueryを例にする）
* Web界隈のツールにも慣れたい


### 使用するツール
ツール名 - バージョン

* node - 0.12.0
* npm - 2.5.1
* tsd - 0.5.7
* bower - 1.4.1
* gulp - 3.8.11
    - gulp-typescript - 2.7.5
    - gulp-webpack - 1.4.0
* WebPack - 1.8.11
    - ts-loader - 0.4.2


### 長くなりそうなので目次
1. node.js / npm のインストール
2. tsd のインストール
3. bower のインストール
4. gulp のインストール
5. WebPack について
6. 開発環境の初期化
7. ライブラリ（jQuery）の取得 + 型定義ファイルの取得
8. TypeScriptでなんか書いてみる
9. gulp で使うプラグインのインストール
10. webpack のインストールと設定
11. gulpfile.jsの作成と実行
12. できたファイルを実行してみる
13. gitignoreファイルの作成
14. さいごに
15. 参考サイト




1.node.js / npm のインストール
----------------------------------------

### 概要
**node.js とは、サーバサイドで動くJavaScriptの"実行環境"。**  
npm とは、「Node Package Manager」の略で、node.jsのパッケージを管理するためのツール。


### インストール
[nodejs.org](https://nodejs.org/) から「INSTALL」または「DOWNLOADS」からインストーラをダウンロードする。  
インストーラをダブルクリックし、インストールする。


### 確認
コマンドプロンプト、またはPowerShellで以下のように入力し、バージョンが表示されれば成功！

```
> node -v
v.0.12.0

> npm -v
2.5.1
```



2.tsd のインストール
----------------------------------------

### 概要
**[tsd](http://definitelytyped.org/tsd/) とは、「TypeScript Definition manager」の略で、TypeScriptの型定義を管理するためのツール。**  
これがないと[DefinitelyTyped - GitHub](https://github.com/borisyankov/DefinitelyTyped)からダウンロードしたりとかなり面倒になる。


### インストール
インストールには、先ほどインストールした npm を使用する。

```
> npm install tsd -g
```

※ **「-g」オプションは、グローバル環境にインストールするという指定。**  
このオプションをつけることで、カレントディレクトリがどこであれ tsdコマンドを使うことができるようになる。  
ちなみにオプションを付けないと、インストールしたディレクトリでしか使えない。


### 確認
コマンドプロンプト、またはPowerShellで以下のように入力し、バージョンが表示されれば成功！

```
> tsd --version
tsd 0.5.7

> tsd -V   // ←短縮版
tsd 0.5.7
```



3.bower（ばうあー） のインストール
----------------------------------------

### 概要
**[bower](http://bower.io/) とは、Twitter製のフロントエンド用パッケージを管理するツール。**

npm と bower の違いは、サーバ向けかクライアント向け。

* npm： サーバ向け（サーバサイド）ライブラリの管理  
       （例：tsd、gulpなど）
* bower： クライアント向け（フロントエンド）ライブラリの管理  
       （例：jQuery、Bootstrapなど）


### インストール
インストールには、npmを使用する。

```
> npm install bower -g
```


### 確認
コマンドプロンプト、またはPowerShellで以下のように入力し、バージョンが表示されれば成功！

```
> bower -v
1.4.1
```



4.gulp（がるぷ） のインストール
----------------------------------------

### 概要
**[gulp](http://gulpjs.com/) とは、いろいろ自動化してくれるタスクランナーというツール。**  
TypeScriptのコンパイルや、JavaScriptの圧縮、Webサーバの更新などをやってくれる。  
「ファイルを監視して、変更（保存）されたらコンパイルする」なんてこともできる。  


### インストール
インストールには(ry

```
> npm install gulp -g
```


### 確認
コマンドプロンプト(ry

```
> gulp -v
[18:03:48] CLI version 3.8.11
```



5.WebPack について
----------------------------------------

### 概要
**[WebPack](http://webpack.github.io/) とは、依存関係にあるJavaScriptのファイルを管理するツール。**  
BrowserifyやRequireJSもこの仲間。

このような依存関係を解消するツールがないと、HTMLのscriptタグに読み込む順番を考えつつ、全ファイルを列挙しなければならない。  
例：[デザインパターンの練習で使ってるリポジトリ](https://github.com/BcRikko/DesignPattern/blob/master/Command%2FMacro%2FMacro.html)


### インストール
ここではインストールしない。  
理由は**gulpを使うためWebPack単体ではなく、gulp-webpackをインストールするためだ。**

また、bowerで取得したライブラリを使うためには無印のwebpackも必要になるが、グローバル環境ではなくルートディレクトリにインストールする必要がある。

そのため、インストール方法は後述する。



6.開発環境の初期化
----------------------------------------
開発環境の初期化を行う。  
開発用フォルダの構成は、以下のとおり。

```
E:\GitHub\TypeScriptDevEnv
│
└─src  // ←ここにTypeScriptのファイルを入れる
```


### npm の初期化
npmの初期化を行い、**今後管理するパッケージをまとめる「package.json」を作成する。**  

```
> npm init
```

コマンドラインで名前やバージョン、詳細説明とかどうしますか？という質問が表示される。  
あとで修正できるので、ここではすべてEnterで通す。

すると、以下のように「package.json」が作成される。

```
E:\GitHub\TypeScriptDevEnv
│  package.json
│
└─src
```


### tsd の初期化
型定義ファイルを管理するために、tsdの初期化を行う。  
個人的に型定義ファイルは、TypeScriptファイルと同じ場所に置きたいので、srcフォルダをルートとして初期化する。

```
> cd src
> tsd init
```

init処理を実行すると以下のようなフォルダ階層になる。  
**「tsd.json」には取得した型定義ファイルの情報が追加される。**

```
E:\GitHub\TypeScriptDevEnv
│  package.json
│
└─src
        tsd.json
```


### bower の初期化
フロントエンドのパッケージを管理するため、bowerの初期化を行う。  
npm同様にコマンドラインで情報どうします？という質問が表示される。  
こちらもあとで修正できるので、すべてEnterで通す。

すると、以下のように「bower.json」が作成される。  
**「bower.json」にはインストールしたパッケージの情報が追加される。**

```
E:\GitHub\TypeScriptDevEnv
│  bower.json
│  package.json
│
└─src
        tsd.json
```


### gulp の初期化
自動コンパイルや圧縮などをするため、gulpの初期化を行う。  
グローバル環境にすでにインストール済みだが、各開発用フォルダにもインストールしなければならないので、もう一度npmでgulpをインストールする。

```
> npm install gulp --save-dev
> npm i gulp -D   // ←短縮版
```

「install --save-dev」と「i -D」は同じ意味なので、後者を使った方が楽。  
**※注意：ここでは「-g」オプションはつけない。**

「--save-dev」オプションをつけることで、package.jsonの「devDependencies」にgulpのバージョンが追加される。  

※「--save」オプションだけだと、package.jsonの「dependencies」に追加されてしまう。  
[npmのマニュアル](https://docs.npmjs.com/files/package.json)に**「Please do not put test harnesses or transpilers in your dependencies object.（超訳："dependencies"にはテスト自動化するモノやトランスパイラを書いちゃダメ！）」**とあるので、基本的には「devDependencies」を使う。


すると、以下のようなフォルダ階層になる。

```
E:\GitHub\TypeScriptDevEnv
│  bower.json
│  package.json
│
├─src
│     tsd.json
└─node_modules
    ├─.bin
    │     （省略）
    └─gulp
           （省略）
```



7.ライブラリ（jQuery）の取得 + 型定義ファイルの取得
----------------------------------------

### ライブラリ（jQuery）の取得
今回は、jQueryを使ったプログラムをつくりたいので、フロントエンド用パッケージ管理ツール「bower」を使ってjQueryを取得する。

まずはsearchコマンドを使って、目的のjQueryがあるか検索する。  
jQueryの場合、大量にでてくるので探すのは大変かもしれないけど…。

```
> bower search jquery
Search results:

    jquery git://github.com/jquery/jquery.git
    jquery-ui git://github.com/components/jqueryui
    jquery.cookie git://github.com/carhartl/jquery-cookie.git
    jquery-placeholder git://github.com/mathiasbynens/jquery-placeholder.git
    qunit git://github.com/jquery/qunit.git
    ・・・
```

次にjQueryのインストールを行う。

```
> bower install jquery --save
bower jquery#*                  cached git://github.com/jquery/jquery.git#2.1.4
bower jquery#*                validate 2.1.4 against git://github.com/jquery/jquery.git#*
bower jquery#~2.1.4            install jquery#2.1.4

jquery#2.1.4 bower_components\jquery
```

こんな感じでjqueryをインストールできる。  
**「--save」オプションをつけることで、bower.jsonの「dependencies」にインストールしたライブラリ名とバージョンが追加される。**

ちなみに、フォルダ階層は以下のようになる。

```
E:\GitHub\TypeScriptDevEnv
│  bower.json
│  package.json
│
├─src
│     tsd.json
│
├─node_modules
│  ├─.bin
│  │     （省略）
│  └─gulp
│         （省略）
│
└─bower_components
    └─jquery
           （省略）
```


### ライブラリ（jQuery）の型定義ファイルの取得
TypeScriptといえば、型定義ファイル。  
ということで、インストールしたライブラリ（jQuery）の型定義ファイルを「tsd」を使って取得する。

まずはqueryコマンドを使って、目的の型定義ファイルがあるか検索する。

```
> tsd query jquery

>> tsd 0.5.7

 - jquery/jquery.d.ts : <head> : 2015-05-19 15:48
```

目的のファイルが見つかったので、srcディレクトリに移動してから型定義ファイルをインストールする。

```
> cd src
> tsd query jquery --save --resolve --action install
> tsd query jquery -rosa install     // ←短縮版

>> tsd 0.5.7

 - jquery/jquery.d.ts : <head> : 2015-05-19 15:48

>> running install..

>> written 1 file:
```

**「--save（-s）」オプションをつけることで、tsd.jsonの「installed」にインストールしたライブラリ名が追加される。**  
「--resolve（-r）」は、依存関係に含む。  
「--action（-a）」オプションは、「--action <name>」のnameを実行する。  
「--overwrite（-o）」は、すでにファイルが存在していても上書きする。

ちなみに、フォルダ階層は以下のようになる。

```
E:\GitHub\TypeScriptDevEnv
│  bower.json
│  package.json
│
├─src
│  │  tsd.json
│  │
│  └─typings
│      │  tsd.d.ts
│      │
│      └─jquery
│              jquery.d.ts
│
├─node_modules
│  ├─.bin
│  │     （省略）
│  └─gulp
│         （省略）
│
└─bower_components
    └─jquery
           （省略）
```



8.TypeScriptでなんか書いてみる
----------------------------------------
今回は、メインファイルとクラスファイルの2つと、実行用のHTMLファイルをつくる。

```javascript
import TestClass = require('./class');

var testClass = new TestClass('テストだよー');
testClass.display();
```

```javascript
/// <reference path="./typings/jquery/jquery.d.ts" />
import $ = require('jquery');

class TestClass {
    private text: string;

    constructor(text: string) {
        this.text = text;
    }

    display(): void {
        $('p').append(this.text);
    }
}

export = TestClass;
```

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="utf-8">
    <title>はじめてのTypeScript開発環境構築</title>
</head>
<body>
    <p>はじめてのTypeScript開発環境構築：</p>
</body>
</html>
```

class.tsで「export class TestClass」ではなく「export = TestClass」としたわけは、

前者だと、ファイル全体をimportしてしまうので、使うときに若干気持ち悪くなる。

```javascript
import TestClass = require('./class');

var testClass = new TestClass.TestClass('テストだよー');
```

後者だと、クラスを指定してexportしていしているので、直感的に使うことができる。

```javascript
import TestClass = require('./class');

var testClass = new TestClass('テストだよー');
```


ただ、このままだとTypeScriptの利点である自動補完をしてくれない。  
**自動補完を有効にするためには、tsconfig.jsonを作成する必要がある。**


### tsconfig.json をつくる
自動補完を有効にするため、tsconfig.jsonをつくる。  
詳細は、[tsconfig.json - TypeScript Wiki](https://github.com/Microsoft/TypeScript/wiki/tsconfig.json)を参照

```json
{
    "version": "1.5.0-alpha",
    "compilerOptions": {
        "target": "es5",
        "module": "commonjs",
        "noImplicitAny": true,
        "removeComments": true,
        "preserveConstEnums": true
    },
    "filesGlob":[
        "./**/*.ts",
        "!./node_modules/**/*/ts"
    ],
    "files": [
        "./app.ts",
        "./class.ts"
    ]
}

```



9.gulp で使うプラグインのインストール
----------------------------------------

### gulp-typescript のインストール
まずは、**TypeScriptをコンパイルするためのプラグイン「gulp-typescript」をインストールする。**

```
> npm install --save-dev gulp-typescript
> npm i -D gulp-typescript    // ←短縮版
```

するとnode_modulesの中にgulp-typescriptがインストールされ、package.jsonの「devDependencies」にgulp-typescriptが追加される。


### gulp-webpack のインストール
gulpで**webpackを実行するためのプラグイン「gulp-webpack」をインストールする。**

```
> npm install --save-dev gulp-webpack
> npm i -D gulp-webpack    // ←短縮版
```


この時点でのフォルダ階層は、以下のとおり。

```
E:\GitHub\TypeScriptDevEnv
│  bower.json
│  package.json
│  index.html
│
├─src
│  │  app.ts
│  │  class.ts
│  │  tsconfig.json
│  │  tsd.json
│  │
│  └─typings
│      │  tsd.d.ts
│      │
│      └─jquery
│              jquery.d.ts
│
├─node_modules
│  ├─.bin
│  │     （省略）
│  ├─gulp
│  │     （省略）
│  ├─gulp-typescript
│  │     （省略）
│  └─gulp-webpack
│         （省略）
│
└─bower_components
    └─jquery
           （省略）
```



10.webpack のインストールと設定
----------------------------------------

### webpack のインストール
**bowerで取得したライブラリ（bower_components内のライブラリ）を、webpackでひとつにまとめるため、無印のwebpackも必要になる**のでインストールする。

これがないと「import $ = require('jquery');」と書けなくなる。  
おそらく「import $ = require('../bower_components/jquery/以下略')」とパスを辿ればいけなくもない気がするけど（ウチの環境ではうまくいかなかった）

```
> npm i -D webpack
```


### ts-loader のインストール
次に**webpackでいろんなファイルを読み込むためには「loader」が必要**になる。  
今回はTypeScriptを読み込ませたいので、「ts-loader」を使う。

```
> npm i -D ts-loader
```


### webpack.config.js の作成
webpackのさまざまな設定をまとめたファイルを作成する。

```javascript
var path = require('path');
var webpack = require('webpack');

module.exports = {
    // エントリーポイント
    entry: './src/app.ts',
    // 出力先
    dest: './dist',
    // 出力するファイル名
    output: {
        filename: 'bundle.js'
    },
    // 依存関係
    resolve: {
        root:[path.join(__dirname, 'bower_components')],
        extensions:['', '.webpack.js', 'web.js', '.js', '.ts']
    },
    // bowerで取得したライブラリの読み込み用プラグイン
    plugins: [
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
        )
    ],
    // TypeScriptを読み込むためのloader
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    }
}
```


この時点でのフォルダ階層は、以下のとおり。

```
E:\GitHub\TypeScriptDevEnv
│  bower.json
│  package.json
│  webpack.confog.js
│  index.html
│
├─src
│  │  app.ts
│  │  class.ts
│  │  tsconfig.json
│  │  tsd.json
│  │
│  └─typings
│      │  tsd.d.ts
│      │
│      └─jquery
│              jquery.d.ts
│
├─node_modules
│  ├─.bin
│  │     （省略）
│  ├─gulp
│  │     （省略）
│  ├─gulp-typescript
│  │     （省略）
│  └─gulp-webpack
│  │     （省略）
│  ├─webpack
│  │     （省略）
│  └─ts-loader
│         （省略）
│
└─bower_components
    └─jquery
           （省略）
```



11.gulpfile.jsの作成と実行
----------------------------------------
**gulpを実行するためには、まずgulpfile.jsを作成する必要がある。**  
このファイルの中に、自動化したい内容を書いていく。

### gulpfile.js の作成
この中に、gulpに自動化してほしい処理を書いていく。  
詳細については[gulp入門 - ドットインストール](http://dotinstall.com/lessons/basic_gulp)などを参照してほしい。

```javascript
var gulp = require('gulp');

var ts = require('gulp-typescript');
var tsConfig = require('./src/tsconfig.json');

var webpack = require('gulp-webpack');
var webpackConfig = require('./webpack.config.js');

// TypeScriptのコンパイルとwebpackの実行
gulp.task('ts', function () {
    // TypeScriptのコンパイル
    var tsResult = gulp.src(['./src/**/*.ts', '!./src/typings'])
        // tscpnfig.jsonに書いたコンパイルオプションの取得
        .pipe(ts(tsConfig.compilerOptions))
        // webpack.config.jsに書いたwebpackの設定取得
        .pipe(webpack(webpackConfig));
    
    // JSファイルをdistに移動
    return tsResult.pipe(gulp.dest('./dist'));
});

// 自動コンパイル
gulp.task('watch', function () {
    // src配下のTSが変更されたら、'ts'タスク（TypeScriptのコンパイル）を実行
    gulp.watch('./src/**/*.ts', ['ts']);
});

// コマンドで「> gulp」と入力するだけでtsタスクとwatchタスクをする
gulp.task('default', ['ts', 'watch']);
```


### gulpの実行
gulpfile.jsが書けたので、あとはコマンドプロンプトなどで「gulp」と入力するだけでよい。

```
> gulp

[13:44:56] Using gulpfile E:\GitHub\TypeScriptDevEnv\gulpfile.js
[13:44:56] Starting 'ts'...
[13:44:56] Starting 'watch'...
[13:44:56] Finished 'watch' after 16 ms
Using config file at E:\GitHub\TypeScriptDevEnv\src\tsconfig.json
[13:45:00] Version: webpack 1.8.11
    Asset    Size  Chunks             Chunk Names
bundle.js  257 kB       0  [emitted]  main
[13:45:00] Finished 'ts' after 4.31 s
[13:45:00] Starting 'default'...
[13:45:00] Finished 'default' after 17 μs

// watch中

```

watchタスクを書くことで、処理が一時停止状態になる。  
これでgulpfile.jsで指定したwatch対象のフォルダ内に変更があると、自動でコンパイルを行ってくれる。  
中断したい場合は、「Ctrl+c」でジョブを終了できる。

watchしたくない場合は、gulpコマンドのあとにタスク名をかけば、タスク実行後に終了してくれる。

```
> gulp ts
```


この時点でのフォルダ階層は、以下のとおり。

```
E:\GitHub\TypeScriptDevEnv
│  bower.json
│  package.json
│  webpack.confog.js
│  gulpfile.js
│  index.html
│
├─dist
│      bundle.js
│
├─src
│  │  app.ts
│  │  class.ts
│  │  tsconfig.json
│  │  tsd.json
│  │
│  └─typings
│      │  tsd.d.ts
│      │
│      └─jquery
│              jquery.d.ts
│
├─node_modules
│  ├─.bin
│  │     （省略）
│  ├─gulp
│  │     （省略）
│  ├─gulp-typescript
│  │     （省略）
│  └─gulp-webpack
│  │     （省略）
│  ├─webpack
│  │     （省略）
│  └─ts-loader
│         （省略）
│
└─bower_components
    └─jquery
           （省略）
```



12.できたファイルを実行してみる
----------------------------------------

### html の修正
現時点では、まだjsファイルを読み込んでいないので、gulp実行時に作成されたbundle.jsを読み込ませる。

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="utf-8">
    <title>はじめてのTypeScript開発環境構築</title>
</head>
<body>
    <p>はじめてのTypeScript開発環境構築：</p>
    
    <script src="./dist/bundle.js"></script>
</body>
</html>
```


### できたファイルの実行
index.htmlを起動すれば、ちゃんと動作していることが確認できる。

[画像]



13.gitignoreファイルの作成
----------------------------------------
現在の作成されているファイルで、Gitで管理対象にすべきでないファイル・フォルダを除外するため、gitignoreファイルを作成する。

普通に「.gitignore」ファイルをつくろうとすると「ファイル名を入力してください」と怒られてしまう。  
そのため**「.gitignore.」と末尾にピリオドをつけることで、ピリオドから始まるファイルを作成することができる。**

あとは、無視したいフォルダ、ファイルを書くだけ。

```
# bower.jsonがあれば「bower install」ですべて取得できるため除外
bower_components

# package.jsonがあれば「npm install」ですべて取得できるため除外
node_modules

# tsd.jsonがあれば「tsd reinstall」ですべて取得できるため除外
src/typings

# gulpを実行すれば自動的に生成されるため除外
dist
```



さいごに
----------------------------------------
まったくの知識ゼロの状態から、ここまでやるのに丸1日ほどかかった。  
なるべく新しいツールばかりを選定したつもりだが、これも早いと数カ月後には「古いツール」になってしまうのかと思うと…。

ProgrammerProfileというサービスをつくった方で、Twitterでもお世話になっているダニエルなかぢさんもこんなことをおっしゃっていた。

<blockquote class="twitter-tweet" data-conversation="none" lang="ja"><p lang="ja" dir="ltr"><a href="https://twitter.com/bc_rikko">@bc_rikko</a> 環境ができた時点で、「俺がやったことは有益なんだろうか・・・ただの自己満足じゃなかろうか・・・」と燃え尽き症候群になったおっさんがここにいますw</p>&mdash; ダニエルなかぢ (@nakazye) <a href="https://twitter.com/nakazye/status/600884175831322624">2015, 5月 20</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>


まさに、今の私の状況だ…ｗ

変化を嫌っていては、Web業界でこの先生きのこれないのはわかるけど、もうちょっと落ち着いて欲しいなぁ。



参考サイト
----------------------------------------
お世話になりました！

### Bower関係
* [Bowerまとめ（概要・導入・コマンド一覧） - Qiita](http://qiita.com/oreo3@github/items/eb790fc091aa28af8d33)
* [Bower入門(基礎編) - from scratch](http://yosuke-furukawa.hatenablog.com/entry/2013/06/01/173308)


### gulp関係
* [gulp入門 (全12回) - プログラミングならドットインストール](http://dotinstall.com/lessons/basic_gulp)
* [gulp.jsを使ってフロントエンドのビルドをする【webpack, stylus】 - yutaponのブログ](http://yutapon.hatenablog.com/entry/2014/12/06/123000)
* [gulp-tscとgulp-typescriptの利用方法の違いについて - Qiita](http://qiita.com/yuichiroharai/items/42e559e2c15e1e5ffa39)
* [usage with gulp](http://webpack.github.io/docs/usage-with-gulp.html)


### WebPack関係
* [Browserify VS Webpack - JS Drama](http://blog.namangoel.com/browserify-vs-webpack-js-drama)
* [JavaScriptのモジュール管理(CommonJSとかAMDとかBrowserifyとかwebpack) | tsuchikazu blog](http://tsuchikazu.net/javascript-module/)
* [jbrantly/ts-loader](https://github.com/jbrantly/ts-loader)
* [webpackを使い倒す - Thujikun blog](http://thujikun.github.io/blog/2014/12/07/webpack/)
* [WebPackを使ってJavaScriptを効率的に書くチュートリアル【入門編】 | 株式会社LIG](http://liginc.co.jp/web/js/other-js/148813)


### TypeScript関係
* [compiler construction - TypeScript compilation error TS5037: Cannot compile external modules unless the '--module' flag is provided - Stack Overflow](http://stackoverflow.com/questions/18210630/typescript-compilation-error-ts5037-cannot-compile-external-modules-unless-the)
* [TypeScriptの型定義ファイルを共有しよう！ - Qiita](http://qiita.com/vvakame/items/1980d4b6cc222e03fdcb)
* [これさえやれば大丈夫! TypeScriptのImportが取っ付きにくい人向け - Qiita](http://qiita.com/armorik83/items/d93fb9c80c489f0fabcf)


### その他
* [npmでnode.jsのpackageを管理する - Qiita](http://qiita.com/sinmetal/items/395edf1d195382cfd8bc)
* [TIPS： Windowsエクスプローラーで「.」で始まる拡張子なしのファイルを作る方法 - IsshikiView](http://tumblr.masahiko.info/post/23718653091/tips-windows)


他にもお世話になったサイトがいっぱいあったと思うのですが、思い出せないのでこのへんで。




以上


written by [@bc_rikko](https://twitter.com/bc_rikko)