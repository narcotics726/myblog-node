---
layout: post
title: "[翻译] from Yes We Jekyll"
description: ""
categories: [to-be-the-MASTER, how-to]
tags: [blog, git, jekyll]
---
{% include JB/setup %}


原文页面在 <a href="http://yeswejekyll.com/">Yes We Jekyll</a>，如果我的渣翻译实在让你觉得头痛的话...

## 关于Jekyll

Jekyll 是一个使用Ruby编写的静态网站生成器。自 <a href="https://page.github.com">GitHub Pages</a> 对其提供支持以来，更是受到了广泛的欢迎。当然Jekyll并非你唯一的选择，不过其“超方便”的网站发布方法实在很棒啦。（我才不告诉你连观海同志在 <a href="http://kylerush.net/blog/meet-the-obama-campaigns-250-million-fundraising-platform/">大选</a>的时候也用了 <a href="https://github.com/mojombo/jekyll">Jekyll</a>）。

本文就将为你详细讲解如何使用Jekyll构建一个自己的网站/博客。跟着我一起念“Jekyll <del>鸡鸡</del>如律令”，这就开始吧

对了，如果确实想跟着一起学的话，最好马上行动起来，第一步很明显就是[安装Jekyll](#)。当然，先快速浏览一下文章再做决定也不迟。

本页面也完全采用了Jekyll构建而成，需要的话所有的源码也欢迎下载研究。如果你有更好的建议，[告诉我](#)，或者直接[pull request](#)。

## 许可

项目的源码可以在[MIT 授权](http://opensource.org/licenses/MIT)的约束下取用。简而言之，只要保留源码的归属，版权声明等等内容，剩下的可以随意使用。

## 开始

一旦成功安装了Jekyll，使用起来事实上是很简单的。多数情况下你要做的只是：cd xxx，jekyll，接下来他就会为你生成一个 `_site` 文件夹，OK结束。

接下来的内容假设你理解基本的[Git](http://gitscm.org/)以及终端命令，否则的话，推荐先对其做一下基本了解。

### 开始新项目

初始化一个新项目大概不是Jekyll的强项，不过我们有别的方法。比如说直接clone [jekyll-bootstrap](http://jekyllbootstrap.com/)。基本的流程如下：

{% highlight bash %}
$ git clone git://github.com/bebraw/yeswejekyll.git <target>
$ cd <target>
$ rm -rf .git
$ git init
$ git add .
$ git commit

在Github上新建一个项目

$ git remote add origin <repo address>
$ git push origin master
{% endhighlight %}

要是你是个像我一样的大懒蛋的话，可以考虑[hub](http://defunkt.io/hub/)看看。这个工具良好集成了Git，同时提供了一些GitHub相关的简洁命令。比如说 git clone username/project 或者 git create -d "description"这样。

如果你更喜欢白手起家的感觉，直接使用git init来初始化一个空白档，然后手动构建目录结构。或许这种方法能让你更加清楚jekyll所要求的基本项目结构。

## 项目结构

根据[官方文档](https://github.com/mojombo/jekyll/wiki/Usage)的说明，一个Jekyll项目的基本结构如下：

    .
    |-- _config.yml
    |-- _includes
    |-- _layouts
    |   |-- default.html
    |   `-- post.html
    |-- _posts
    |   |-- 2007-10-29-why-every-programmer-should-play-nethack.textile
    |   `-- 2009-04-26-barcamp-boston-4-roundup.textile
    |-- _site
    `-- index.html

同时，定义一个`.gitignore`文件来将`_site`文件夹排除在外也是个好办法，通常我们不需要对他进行版本控制。

### \_config.yml

`_config.yml` 包含了网站的全局设置，同时也用作定义一些Jekyll生成时的默认参数。个人建议至少采用以下参数以和GitHub设置保持一致。另外，[这里](https://github.com/mojombo/jekyll/wiki/configuration)还有许多其他可选的设置。

在这些选项中，我想格外讲一讲 `exclude`。 很容易猜到，这个选项可以设置Jekyll生成时需要跳过的文件或目录。检查一下生成后的 `_site` 目录，也许可以让你更清楚哪些东西需要包括在内，而哪些不需要。

{% highlight yaml %}
port: 4000
auto: true
safe: true
server: true
pygments: true
{% endhighlight %}

基于这些设置，`jekyll`命令将生成并部署一个本地服务器，并且在你修改文件时自动重新生成。这一点或许会很有用。出于个人需要，你或许会调整 `port` 和 `pygments` 选项。

本人推荐设置一个[LiveReload](http://livereload.com/)或是其他的相似工具，免得在开发调试期间不停的手动刷新页面。

`_config` 中还有个挺有用的选项，可以利用他在模板中引用指定对象，语法大约是这样  {{ "{ site.property " }}} 。稍后会详细解释。

### \_layouts

顾名思义， `_layouts` 里包含了项目的布局文件，这些布局文件是页面内容的骨架。至少定义一个默认模板，然后可以随需求定义出各种辅助模板。

如果你是个像我这样又懒又没想象力的家伙，可以试试看[HTML5 Boilerplate](http://html5boilerplate.com/)，然后在此基础上搞点花样。不过要记得的在模版内需要插入实际页面内容的地方写上 `{{"{ content "}}}` 标签。

前面我们讲过可以利用类似 `{{"{ site.property "}}}` 这样的标签来引用一些全局属性。同样的，在单个页面中，也有 `{{"{ page.property "}}}` 这样的用法。

如果还想继续深入了解更多这方面的内容的话，可以去翻阅一下[Liquid](http://liquidmarkup.org/)文档，也就是我们这里使用的模板引擎。Jekyll也提供了其他[一些扩展](https://github.com/mojombo/jekyll/wiki/Liquid-Extensions)，后面会对扩展进行详细的说明。

### \_includes

`_includes` 可以引用页面外的数据内容，比如：

 {{ "{% include about.md " }}%}

或许你注意到了，我使用的是 `md` 扩展名，也就是[Markdown 语法](http://daringfireball.net/projects/markdown/syntax)。

除了HTML和Markdown以外，也可以使用[Textile](http://redcloth.org/textile)。相比下我比较喜欢Markdown，因为Github和StackOverflow这两个程序猿聚集地都用了这个。而且稍加熟悉之后，Markdown确实有够好用。

### index.html

我不记得前面有没有提到过，Jekyll是根据后缀名推断文件内容的语法格式的。所以除了 `index.html` ，写一个index.md也是完全可以的。

不管怎样，有一件事是必须做的。你得定义一些叫做 [YAML Front Matter](https://github.com/mojombo/jekyll/wiki/YAML-Front-Matter)的东西。这东西关系到整个页面的内容，像这样：

{% highlight yaml %}
---
layout: default
title: About
css: index
js: index
---
{% endhighlight %}

这些在layout文件中定义好的属性就可以在这里派上用场，比方在这里我就插入了关于页面标题，自定义CSS与JS文件。还可以利用下面的 `if` 代码以防找不到这些文件时发生错误。

    {{ "{% if page.css " }}%}<link rel="stylesheet" href="/css/{{ "{{ page.css " }}}}.css" type="text/css" />{{ "{% endif " }}%}

### \_posts

 `_posts` 目录存放所有的blog帖子。不过我是懒得每次新建帖子时都要根据默认的命名规则每次都打一长串的文件名啦，所以推荐使用 [jekyll-bootstrap Rakefile](https://github.com/plusjade/jekyll-bootstrap/blob/master/Rakefile) 来帮你新建文件。直接把它复制到项目根目录就好，剩下的自己摸索去吧！

算了还是随便说两句好了，首先保证根目录下存在 `_posts` 目录，然后使用 `rake post title="First Post"`。当然也可以传入诸如日期或是标签之类的参数。

默认情况下生成的文件使用 `post` 布局，并且还有一条额外的 `include` 命令。你可以根据自己需要对Rakefile本身做一些微调。

既然写好了文章，接下来又如何让别人访问它呢。最直接的方法就是使用  /年/月/日/文章名称.html  这样的URL。关于blog文件的命名规则可以在 [permalink configuration](https://github.com/mojombo/jekyll/wiki/Permalinks) 里修改。默认值是 `date` ，可以改成 `pretty` (hides.html) 或是 none (完全不显示日期)。

不过这样直接写路径确实有点麻烦。试试看 Liqud Templating :

{% highlight html %}
{{ "{% for post in site.posts offset: 0 limit: 10 " }}%}
    <h2>
        <a href="{{ "{{ site.prefix " }}}}{{ "{{ post.url " }}}}">{{ "{{ post.title " }}}}</a>
    </h2>
    {{ "{{ post.date | date_to_string " }}}}
    {{ "{{ post.content " }}}}
    <hr />
{{ "{% endfor " }}%}
{% endhighlight %}

如果这样也不够的话，还可以使用 [pagination](https://github.com/mojombo/jekyll/wiki/Pagination) 也就是分页。

这样写则可以显示blog存档:

{% highlight html %}
<ul>
{{ "{% for post in site.posts " }}%}
    <li>
        <div class="date">{{ "{{ post.date | date_to_string " }}}}</div>
        <a href="{{ "{{ site.prefix  " }}}}{{ "{{ post.url " }}}}">{{ "{{ post.title " }}}}</a>
    </li>
{{ "{% endfor " }}%}
</ul>
{% endhighlight %}

如果想把现有的博客迁移到Jekyll上来的话，这里有[几种迁移方法](https://github.com/mojombo/jekyll/wiki/Blog-Migrations)可以供你参考一下。

这里则是为你准备的[一个Atom例子](https://github.com/bebraw/geekcollision-site/blob/master/atom.xml)，可以通过它来为你的博客添加一个feed订阅功能。

不过大多数人可能完全不愿意操这份儿码农的心，如果只是想找个地方好好的写文章的话，试试看[Octopress](http://octopress.org/)，建立在Jekyll上的一个博客框架，其中包含了基本的模板。

### \_site

这里就是Jekyll的输出生成目录了。通常我们会把这个目录写进[.gitignore](https://www.kernel.org/pub/software/scm/git/docs/gitignore.html)里面，版本控制不需要包含输出文件。本地调试的时候可以多关心一下它。

## 发布

到这一步就简单啦。基本上你要做的就是把 `_site` 目录上传到服务器。而且如果你本来就打算在Github上发布博客的话，连这一步都可以省略，直接把项目push上去就OK。

默认情况下在GitHub Pages上无法使用Jekyll插件。不过可以采取一些[特殊方法](http://charliepark.org/jekyll-with-plugins/)，这样的话，每次发布时你所做的就是把本地生成好文件上传到GitHub，而不是让GitHub替你生成。

如果你暂时对默认流程没什么意见的话，我这里有一些脚本可以帮到你。在GitHub的项目页面上托管的博客需要建立在 `gh-pages` 分支下。分支的含义我就不讲了...我的做法一般是把 `master` 分支 复制到 `gh-pages` 下。 像这样 `git push origin master:gh-pages`。

我的项目下面一般还会有这样一段脚本来帮我快速发布内容：

{% highlight bash %}
#!/bin/bash
cd "$(dirname"$0")"
git push
git push origin master:gh-pages
git push --tags
{% endhighlight %}

除了GitHub之外，把你的网站发布在 [Heroku](http://www.garron.me/blog/deploy-host-jekyll-static-site-free-heroku.html) 或是 [Amazon S3](http://vvv.tobiassjosten.net/development/jekyll-blog-on-amazon-s3-and-cloudfront/) 也不错。甚至还可以在本地建立一个指向GitHub或是其他服务端的代理服务器。也许这么做会让原本简单的事情变得越加复杂，不过，这不就是程序猿们的天性么...

## Jekyll的优势与劣势

大多数情况下，使用GitHub+Jekyll的做法已经很足够了。交互方面可以通过JavaScript来实现。总之如果只是想建立一个简单的博客或是小型网站，Jekyll都是一个明智之选。

### Jekyll vs. WordPress

与功能完备又强大的WordPress相比，Jekyll有着一些显著的优势。对程序猿而言无比亲切的 “Git 驱动式开发流程”，一般而言更好的安全性，无需操心服务器更新的问题（交给GitHub的那些家伙去做啦）,静态网站的建立非常简单，而且有了Git，几乎走到哪里都可以随时更新日志。

当然，某些情景下WordPress会是个更好的选择。对非技术人员来说更为友好的操作，而且已经有了一个庞大的社区群体。大量牛逼闪闪的插件。不过，前面说过啦，这些强大的功能也带来了更多的隐患，尤其是在安全方面。

### 弱点

前面也有提到过，Jekyll不太擅长处理及其复杂的信息结构。

使用Markdown撰写内容使用Html设计布局是个很不错的做法。问题在于某些时候，比如你想为JS代码建立一些hooks的时候，就需要在文本内容上附加一些选择器(classifiers)。目前而言，这时候你就不得不使用HTML了。

一些允许你在HTML文档中插入Markdown语言的插件或许可以稍微缓解这样的问题（默认情况下你只能在Markdown文件内加入一些HTML，反过来不行）。

虽然一般情况下可能不会碰到这样的问题，不过当你在考虑建立一个比博客网站复杂的多的站点时，最好还是放弃Jekyll，或者添加一系列的插件。

## 锦上添花

本文到此，想必你应该已经创建了一个粗略的网站了。功能齐备，就是有点丑。现在想办法为你的网站添上几笔色彩吧！

### 基于Foundation的开发

[Zurb Foundation](http://foundation.zurb.com/) 是除了当下炙手可热的 [Twitter Bootstrap](http://twitter.github.com/bootstrap/) 之外的一个选择。鉴于我本人的弱势情结，接下来为你介绍如何把 Foundation 良好的集成到你的项目当中。

先把原版Foundation下载下来，解压。里面应该有两个文件夹，css 和 js 。把他们复制到你的项目里面。

感兴趣的话也可以打开其中的 `index.html` 看看。里面有最基本的范例供你参考。

然后，可以去挑选一些[预设布局](http://foundation.zurb.com/templates.php)。我觉得那个 Blog 布局就挺不错的，随你挑啦。

继续下一步之前还是要记得在页面中插入 {{"{ content "}}} 标签。还有，在你的 `head` 上（不是你脖子上的那个head!）加上这些东西：

{% highlight css %}
<link rel="stylesheet" href="css/normalize.css">
<link rel="stylesheet" href="css/foundation.css">
{% endhighlight %}

`normalize` 主要用作适配浏览器兼容性，每个页面都要用到所以直接加上。后面一行明显就是 Foundation 的主要内容了。同时还有一个迷你版的，名字叫 `foundation.min.css`。你问我为啥迷你版的名字反而这么长，反正我是不知道...

接下来应该还需要一系列的微调：你肯定不希望在大费周章的避开了当下最火的Bootstrap模板采用Foundation了以后，整个网站看上去依然和那些“Bootstrap症候群”的站点差不多。不过我们用的是Foundation，所以安啦，好好看看 [Foundation 的官方文档](http://foundation.zurb.com/docs/) 吧。

### 挑选一个配色方案

这些是挺让人头疼的一个环节。我这人挺无聊的，所以选了一套灰色调的配色，又加了一点点材质。像 [Color Scheme Designer](http://colorschemedesigner.com/) 这样的工具应该是挺有用的。

还有不少[其他的工具](http://webdesignledger.com/tools/10-super-useful-tools-for-choosing-the-right-color-palette)，像我这种非专业人士其实不怎么用这些东西，不过 Chrome 的 审查元素 功能还是要好好利用。

另外，我个人不太喜欢过亮的颜色，适当的色彩层级也很有帮助，色彩可以帮助你突出重点，淡化次要元素。这些细节可以更好的留住你的读者。

要是上面说的那些东西你都没啥心情去研究的话，直接用纯白色（稍微调低点亮度更好）加一些稍暗的颜色。通常来说#111或是#222要比#000(纯黑)会好一些。多多注意这些细节，会让你的页面给人更加舒服的感觉。

大块的纯色会让人变得恍惚，当然这也因人而异。我更喜欢使用一些微纹理的材质。色彩构成是设计的基础，而恰当的材质会更添魅力。

### 设计视觉层级

突出重点而淡化次要元素是一个非常重要的设计理念，但常被大家所忽略。版头，标题，字体，材质等等都可以用来构成视觉层级。这些元素能帮助读者把注意力放在关键的地方。

### 使用微纹理材质

这一点上大概很多人会产生分歧，有些人更偏爱粗旷风格的材质。我则更喜欢细致一些的[微纹理](http://subtlepatterns.com/)。

`微纹理材质`就是...呃...纹理很微小的材质...总之这些材质的纹理都很细小，但产生的效果显著。用他们来做背景再好不过了。

使用Chrome的读者可以试试看[Subtle Patterns Chrome Extension](https://github.com/overra/Subtle-Patterns-Chrome-Extension)。

todo：Toggle Patterns

### 插入图片或影像




### 添加一些小细节


### 选择字体


### 测试你的设计


### 建立网站分析


### 使用Pygments实现代码着色


### 其他资源


## 总结



<p>{{ page.date|date_to_string }}</p>