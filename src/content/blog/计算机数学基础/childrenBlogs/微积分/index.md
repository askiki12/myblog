---
title: 微积分
description: 面向计算机科研的微积分速查：极限、导数与泰勒展开、多元微分、矩阵微积分、梯度下降与凸优化、积分与期望，以及常用公式与教材。
pubDate: 2026-10-03
tags: ['数学', '微积分', '优化', '机器学习']
---

微积分是计算机科学研究里的“连续语言”。训练神经网络本质上是对损失函数求梯度，分析迭代算法的收敛速度要用极限刻画误差衰减，推导概率分布与信息量则离不开积分。本文按“科研够用”的原则组织：先建立导数与泰勒展开的直觉，再进入多元微分、矩阵微积分与最优化，最后补齐积分、级数、微分方程与常用公式。

## 1. 极限与连续

### 1.1 数列极限

数列 $\{a_n\}$ 收敛到 $L$，记作 $\displaystyle\lim_{n\to\infty} a_n = L$，是指：

$$
\forall \varepsilon>0,\quad \exists N\in\mathbb{N},\quad \forall n>N:\ |a_n-L|<\varepsilon .
$$

直观地说，$a_n$ 可以任意接近 $L$。若不存在这样的 $L$，称数列发散。

**柯西收敛准则**：$\{a_n\}$ 收敛当且仅当对任意 $\varepsilon>0$，存在 $N$，使得任意 $m,n>N$ 都有 $|a_m-a_n|<\varepsilon$。这在数值分析中很重要——它允许我们**不预知极限**就判断收敛。

### 1.2 函数极限与连续

函数极限 $\displaystyle\lim_{x\to x_0} f(x)=L$ 的 $\varepsilon$-$\delta$ 定义：

$$
\forall \varepsilon>0,\ \exists \delta>0,\quad 0<|x-x_0|<\delta \Rightarrow |f(x)-L|<\varepsilon .
$$

若 $\lim_{x\to x_0} f(x)=f(x_0)$，称 $f$ 在 $x_0$ 处连续。闭区间 $[a,b]$ 上的连续函数满足：

- **介值定理**：取到 $f(a)$ 与 $f(b)$ 之间的一切值；
- **最值定理**：必取到最大值与最小值；
- **一致连续**：$\delta$ 可只依赖于 $\varepsilon$ 而不依赖于 $x_0$。

### 1.3 常用极限与等价无穷小

当 $x\to 0$ 时（这些是数值稳定与渐近分析的基础）：

$$
\lim_{x\to 0}\frac{\sin x}{x}=1,\qquad
\lim_{x\to 0}\frac{e^{x}-1}{x}=1,\qquad
\lim_{x\to 0}\frac{\ln(1+x)}{x}=1,
$$
$$
\lim_{x\to 0}\frac{1-\cos x}{x^{2}}=\frac12,\qquad
\lim_{x\to\infty}\Bigl(1+\frac1x\Bigr)^{x}=e .
$$

常用的等价无穷小（$x\to0$）：$\sin x\sim x$，$\tan x\sim x$，$1-\cos x\sim \tfrac12 x^2$，$\ln(1+x)\sim x$，$e^{x}-1\sim x$，$(1+x)^\alpha-1\sim \alpha x$。

### 1.4 与算法分析的接口

极限是渐近记号的语言。$g(n)=O(f(n))$ 表示存在常数 $C>0$ 与 $n_0$，使 $n>n_0$ 时 $|g(n)|\le C|f(n)|$，等价于

$$
\limsup_{n\to\infty}\frac{|g(n)|}{|f(n)|}<\infty .
$$

$\Theta$、$\Omega$、$o$ 记号同理。此外，**压缩映射原理**（Banach 不动点定理）指出：若映射 $T$ 满足 $\|T(x)-T(y)\|\le q\|x-y\|$（$0\le q<1$），则迭代 $x_{k+1}=T(x_k)$ 收敛到唯一不动点，且误差按 $O(q^k)$ 衰减。这是分析迭代算法收敛的基本框架。

## 2. 单变量微分

### 2.1 导数与微分

$$
f'(x)=\frac{df}{dx}=\lim_{h\to 0}\frac{f(x+h)-f(x)}{h}.
$$

微分 $df=f'(x)\,dx$ 是增量的线性主部：$f(x+h)=f(x)+f'(x)h+o(h)$。可导必连续，反之不真（如 $|x|$ 在 $0$ 处）。

### 2.2 求导法则

设 $u,v$ 可导：

$$
(u\pm v)'=u'\pm v',\quad (uv)'=u'v+uv',\quad \Bigl(\frac uv\Bigr)'=\frac{u'v-uv'}{v^2},
$$
$$
\bigl(f(g(x))\bigr)'=f'(g(x))\,g'(x)\qquad\text{(链式法则)}.
$$

**反函数**：若 $f'(x)\neq 0$，则 $\bigl(f^{-1}\bigr)'(y)=\dfrac{1}{f'(x)}$，其中 $y=f(x)$。

### 2.3 常用导数

| $f(x)$ | $f'(x)$ |
| --- | --- |
| $x^\alpha$ | $\alpha x^{\alpha-1}$ |
| $e^{x}$ | $e^{x}$ |
| $a^{x}$ | $a^{x}\ln a$ |
| $\ln x$ | $1/x$ |
| $\log_a x$ | $1/(x\ln a)$ |
| $\sin x$ | $\cos x$ |
| $\cos x$ | $-\sin x$ |
| $\tan x$ | $\sec^2 x$ |
| $\arcsin x$ | $1/\sqrt{1-x^2}$ |
| $\arctan x$ | $1/(1+x^2)$ |
| $\sinh x$ | $\cosh x$ |
| $\cosh x$ | $\sinh x$ |

### 2.4 高阶导数与单调性

$n$ 阶导数记为 $f^{(n)}$。乘积的 Leibniz 公式：

$$
(uv)^{(n)}=\sum_{k=0}^{n}\binom{n}{k}u^{(k)}v^{(n-k)}.
$$

**中值定理**（拉格朗日）：$f$ 在 $[a,b]$ 连续、$(a,b)$ 可导，则存在 $\xi\in(a,b)$ 使

$$
f(b)-f(a)=f'(\xi)(b-a).
$$

由此：$f'\ge 0$ 则单调不减；$f'\le 0$ 则单调不增。二阶导 $f''$ 决定凹凸性：$f''\ge 0$ 为凸函数。

**洛必达法则**：处理 $\tfrac00$ 或 $\tfrac{\infty}{\infty}$ 型极限，$\displaystyle\lim\frac{f}{g}=\lim\frac{f'}{g'}$（在条件满足时）。

## 3. 泰勒展开与近似

### 3.1 泰勒公式

若 $f$ 在 $a$ 的邻域内有 $n+1$ 阶导数，则

$$
f(x)=\sum_{k=0}^{n}\frac{f^{(k)}(a)}{k!}(x-a)^{k}+R_n(x),
$$

其中余项可取皮亚诺形式 $R_n(x)=o\bigl((x-a)^n\bigr)$，或拉格朗日形式

$$
R_n(x)=\frac{f^{(n+1)}(\xi)}{(n+1)!}(x-a)^{n+1},\qquad \xi\text{ 介于 }a,x\text{ 之间}.
$$

$a=0$ 时称为**麦克劳林展开**。

### 3.2 常用麦克劳林展开

$$
\begin{aligned}
e^{x}&=1+x+\frac{x^2}{2!}+\frac{x^3}{3!}+\cdots,\\
\ln(1+x)&=x-\frac{x^2}{2}+\frac{x^3}{3}-\cdots,\quad |x|<1,\\
\frac{1}{1-x}&=1+x+x^2+\cdots,\quad |x|<1,\\
\sin x&=x-\frac{x^3}{3!}+\frac{x^5}{5!}-\cdots,\\
\cos x&=1-\frac{x^2}{2!}+\frac{x^4}{4!}-\cdots,\\
(1+x)^\alpha&=1+\alpha x+\frac{\alpha(\alpha-1)}{2}x^2+\cdots,\quad |x|<1.
\end{aligned}
$$

### 3.3 科研中的用途

- **误差分析**：从一阶泰勒得到前向误差 $f(x+\Delta)\approx f(x)+f'(x)\Delta$，相对误差中 $f'(x)\Delta/f(x)$ 即**条件数**的来源。
- **数值稳定性**：$\ln(1+x)$ 在 $x\approx 0$ 时用级数或 `log1p` 计算；$\operatorname{softmax}$ 通过减去最大值 $\max_i z_i$ 避免 $e^{z}$ 上溢，其合法性来自 $e^{z_i-m}/e^{z_j-m}$ 的分子分母同时缩放。
- **二阶方法**：牛顿法用二阶泰勒近似目标函数。

## 4. 多元函数微分

### 4.1 偏导数与梯度

设 $f:\mathbb{R}^n\to\mathbb{R}$。对第 $i$ 个变量的偏导

$$
\frac{\partial f}{\partial x_i}=\lim_{h\to0}\frac{f(x_1,\dots,x_i+h,\dots,x_n)-f(x)}{h},
$$

**梯度**为所有偏导组成的列向量

$$
\nabla f(x)=\Bigl(\frac{\partial f}{\partial x_1},\dots,\frac{\partial f}{\partial x_n}\Bigr)^{\top}\in\mathbb{R}^n .
$$

**方向导数**沿单位向量 $v$ 为 $D_v f(x)=\nabla f(x)^{\top}v=\langle\nabla f(x),v\rangle$，在 $v=\nabla f/\|\nabla f\|$ 时取最大值。这就是“梯度指向增长最快方向”的含义，也是梯度下降的几何依据。

### 4.2 雅可比与海森矩阵

对向量值函数 $f:\mathbb{R}^n\to\mathbb{R}^m$，**雅可比矩阵**为

$$
J_f(x)=\frac{\partial f}{\partial x}=\begin{bmatrix}
\dfrac{\partial f_1}{\partial x_1} & \cdots & \dfrac{\partial f_1}{\partial x_n}\\
\vdots & \ddots & \vdots\\
\dfrac{\partial f_m}{\partial x_1} & \cdots & \dfrac{\partial f_m}{\partial x_n}
\end{bmatrix}\in\mathbb{R}^{m\times n}.
$$

标量函数的**海森矩阵** $H(x)=\nabla^2 f(x)\in\mathbb{R}^{n\times n}$，元素 $H_{ij}=\dfrac{\partial^2 f}{\partial x_i\partial x_j}$。当二阶偏导连续（Clairaut 定理）时 $H$ 对称。

### 4.3 链式法则

- 标量复合：$\dfrac{d}{dt}f(x(t))=\nabla f(x)^{\top}\dot x$。
- 一般形式：若 $z=f(y)$、$y=g(x)$，则 $\dfrac{\partial z}{\partial x}=\dfrac{\partial z}{\partial y}\dfrac{\partial y}{\partial x}$（雅可比相乘）。

反向传播正是这条法则对计算图 repeatedly 的应用：把雅可比连乘，从输出层向输入层逐层回传。

### 4.4 多元泰勒展开

$$
f(x+\Delta)=f(x)+\nabla f(x)^{\top}\Delta+\frac12\Delta^{\top}H(x)\Delta+o(\|\Delta\|^2).
$$

### 4.5 隐函数定理

若 $F(x,y)=0$ 且 $\dfrac{\partial F}{\partial y}\neq 0$，则可局部解出 $y=y(x)$，且

$$
\frac{dy}{dx}=-\Bigl(\frac{\partial F}{\partial y}\Bigr)^{-1}\frac{\partial F}{\partial x}.
$$

### 4.6 凸性

- **凸集**：$C$ 中任意两点连线仍在 $C$ 中：$\lambda x+(1-\lambda)y\in C,\ \lambda\in[0,1]$。
- **凸函数**：对任意 $x,y$ 与 $\lambda\in[0,1]$，
$$
f(\lambda x+(1-\lambda)y)\le \lambda f(x)+(1-\lambda)f(y).
$$

**判别条件**（$f$ 可微）：

- 一阶：$f(y)\ge f(x)+\nabla f(x)^{\top}(y-x)$，即函数位于其切平面之上；
- 二阶：$\nabla^2 f(x)\succeq 0$（半正定）处处成立。

**Jensen 不等式**：对凸函数 $f$ 与随机变量 $X$，$f(\mathbb{E}[X])\le\mathbb{E}[f(X)]$。它是变分推断、EM 算法中下界推导的核心。

**保凸运算**：非负加权和、与仿射映射复合 $f(Ax+b)$、逐点取上确界、部分变量的下确界等，都保持凸性。

## 5. 矩阵微积分

矩阵微积分把标量/向量/矩阵的求导统一成一套公式，是推导机器学习模型梯度的利器。以下采用**分母布局**：标量 $f$ 对向量 $x$ 的导数 $\dfrac{\partial f}{\partial x}$ 是列向量；$f$ 对矩阵 $X$ 的导数与 $X$ 同形。

### 5.1 基本恒等式

设 $a\in\mathbb{R}^n$，$A\in\mathbb{R}^{n\times n}$，$x\in\mathbb{R}^n$：

$$
\frac{\partial\,(a^{\top}x)}{\partial x}=a,\qquad
\frac{\partial\,(x^{\top}a)}{\partial x}=a,\qquad
\frac{\partial\,\|x\|_2^2}{\partial x}=\frac{\partial\,(x^{\top}x)}{\partial x}=2x,
$$
$$
\frac{\partial\,(x^{\top}Ax)}{\partial x}=(A+A^{\top})x,
\qquad\text{若 }A\text{ 对称则 }=2Ax .
$$

对矩阵 $X$（$A,B$ 与 $X$ 形状相容）：

$$
\frac{\partial\,\operatorname{tr}(AX)}{\partial X}=A^{\top},\qquad
\frac{\partial\,\operatorname{tr}(X^{\top}A)}{\partial X}=A,
$$
$$
\frac{\partial\,\|X\|_F^2}{\partial X}=2X,\qquad
\frac{\partial\,\ln\det X}{\partial X}=X^{-\top}\quad(X\succ0),
$$
$$
\frac{\partial\,\operatorname{tr}(X^{-1}A)}{\partial X}=-(X^{-1}AX^{-1})^{\top}.
$$

### 5.2 向量值函数的雅可比

$$
\frac{\partial (Ax)}{\partial x}=A,\qquad
\frac{\partial (Ax+b)}{\partial x}=A,\qquad
\frac{\partial\,\operatorname{tr}(AXB)}{\partial X}=A^{\top}B^{\top}.
$$

### 5.3 两个高频例子

**最小二乘**：$f(x)=\tfrac12\|Ax-b\|_2^2$。由

$$
f(x)=\tfrac12(Ax-b)^{\top}(Ax-b),\qquad
\nabla f(x)=A^{\top}(Ax-b),
$$

令梯度为零得正规方程 $A^{\top}Ax=A^{\top}b$，当 $A$ 列满秩时 $x=(A^{\top}A)^{-1}A^{\top}b$。

**Logistic 回归（二分类）**：$p=\sigma(w^{\top}x)$，$\sigma(z)=1/(1+e^{-z})$，交叉熵损失 $\ell=-\bigl[y\ln p+(1-y)\ln(1-p)\bigr]$。利用

$$
\sigma'(z)=\sigma(z)\bigl(1-\sigma(z)\bigr),
$$

可得

$$
\nabla_w \ell=(p-y)\,x .
$$

**Softmax**：$p_i=\dfrac{e^{z_i}}{\sum_j e^{z_j}}$，其雅可比为

$$
\frac{\partial p_i}{\partial z_j}=p_i(\delta_{ij}-p_j),
$$

其中 $\delta_{ij}$ 为 Kronecker 符号（$i=j$ 为 $1$，否则为 $0$）。

## 6. 最优化

### 6.1 无约束问题的一阶/二阶条件

考虑 $\displaystyle\min_{x\in\mathbb{R}^n} f(x)$。

- **必要条件**：局部最优（内点）满足 $\nabla f(x^{*})=0$；
- **二阶必要**：$\nabla^2 f(x^{*})\succeq 0$；
- **二阶充分**：$\nabla f(x^{*})=0$ 且 $\nabla^2 f(x^{*})\succ 0$ 时 $x^{*}$ 为严格局部极小；
- 若 $f$ 凸，则驻点即**全局**最优。

### 6.2 梯度下降

迭代

$$
x_{k+1}=x_k-\eta\nabla f(x_k),
$$

其中 $\eta>0$ 为学习率。若 $f$ 是 $L$-光滑（$\nabla f$ 为 $L$-Lipschitz）且 $\mu$-强凸，则取 $\eta=1/L$ 时

$$
f(x_k)-f(x^{*})\le\Bigl(1-\frac{\mu}{L}\Bigr)^{k}\bigl(f(x_0)-f(x^{*})\bigr),
$$

即线性收敛，收敛速率由条件数 $\kappa=L/\mu$ 控制。$\kappa$ 越大越“病态”，这也是需要对特征做归一化、用预条件/动量加速的原因。

**随机梯度下降（SGD）**用无偏估计 $g_k$ 满足 $\mathbb{E}[g_k\mid x_k]=\nabla f(x_k)$，以降低每次迭代代价。**动量**与 **Adam** 在此基础上引入一阶/二阶矩的指数滑动平均：$m_k=\beta_1 m_{k-1}+(1-\beta_1)g_k$，$v_k=\beta_2 v_{k-1}+(1-\beta_2)g_k^2$，再做偏差修正后更新。它们不改变一阶最优性条件，只是改善条件数带来的收敛行为。

### 6.3 牛顿法与拟牛顿

牛顿法用二阶信息：

$$
x_{k+1}=x_k-\bigl[\nabla^2 f(x_k)\bigr]^{-1}\nabla f(x_k).
$$

在极小点附近具有二次收敛，但每步需解线性方程组且要求海森正定。**拟牛顿**（如 BFGS、L-BFGS）用梯度差近似海森或其逆，兼顾速度与成本，是有限内存场景的常用选择。

### 6.4 约束优化与 KKT

考虑 $\min f(x)$ s.t. $g_i(x)\le 0,\ h_j(x)=0$。构造拉格朗日函数

$$
\mathcal{L}(x,\lambda,\nu)=f(x)+\sum_i\lambda_i g_i(x)+\sum_j\nu_j h_j(x).
$$

在约束规范（如 Slater 条件）下，$x^{*}$ 最优的 **KKT 条件**为：平稳性 $\nabla_x\mathcal{L}=0$、原始可行、对偶可行 $\lambda_i\ge0$、互补松弛 $\lambda_i g_i(x^{*})=0$。对偶问题为 $\max_{\lambda\ge0,\nu}\min_x\mathcal{L}$；强对偶在凸问题下成立。这是 SVM、约束强化学习等问题的统一框架。

## 7. 积分

### 7.1 定积分与微积分基本定理

黎曼和：把 $[a,b]$ 分成小区间，$\displaystyle\int_a^b f(x)\,dx=\lim_{\max\Delta x_i\to0}\sum_i f(\xi_i)\Delta x_i$。

**微积分基本定理**：若 $F'=f$，则

$$
\int_a^b f(x)\,dx=F(b)-F(a).
$$

即求积分是求导的逆运算。

### 7.2 常用方法

- **换元**：$\displaystyle\int f(g(x))g'(x)\,dx=\int f(u)\,du$，$u=g(x)$。
- **分部**：$\displaystyle\int u\,dv=uv-\int v\,du$。
- **反常积分**：$\displaystyle\int_a^{\infty}f=\lim_{b\to\infty}\int_a^b f$，收敛需极限存在。

### 7.3 多重积分与 Fubini

二重积分可化为累次积分（Fubini 定理，在可积条件下）：

$$
\iint_D f(x,y)\,dA=\int\Bigl(\int f(x,y)\,dx\Bigr)dy.
$$

### 7.4 概率与期望

连续随机变量 $X$ 的期望与方差是积分：

$$
\mathbb{E}[X]=\int_{-\infty}^{\infty} x\,p(x)\,dx,\qquad
\operatorname{Var}(X)=\mathbb{E}\bigl[(X-\mathbb{E}X)^2\bigr]=\mathbb{E}[X^2]-(\mathbb{E}X)^2 .
$$

一个重要积分（高斯积分）：

$$
\int_{-\infty}^{\infty}e^{-x^2/2}\,dx=\sqrt{2\pi},\qquad
\int_{-\infty}^{\infty}e^{-ax^2+bx}\,dx=\sqrt{\frac{\pi}{a}}\,e^{b^2/(4a)} .
$$

它支撑了正态分布归一化常数、高斯过程与核方法中的大量推导。

### 7.5 信息论中的积分

连续分布的**微分熵** $h(X)=-\int p(x)\ln p(x)\,dx$；**KL 散度**

$$
D_{\mathrm{KL}}(p\|q)=\int p(x)\ln\frac{p(x)}{q(x)}\,dx\ge0 .
$$

这两者是变分自编码器、最大似然与信息瓶颈等方法的出发点。

## 8. 级数与近似

### 8.1 常见级数

$$
\sum_{n=0}^{\infty} r^{n}=\frac{1}{1-r}\ (|r|<1),\qquad
\sum_{n=1}^{\infty}\frac{1}{n^{s}}\ \text{收敛当且仅当 } s>1 .
$$

幂级数 $\sum a_n x^n$ 的**收敛半径** $R=1/\limsup_{n}|a_n|^{1/n}$，在 $|x|<R$ 内可逐项求导与积分。

### 8.2 Stirling 近似

$$
\ln n!\approx n\ln n-n+\frac12\ln(2\pi n),\qquad
n!\sim\sqrt{2\pi n}\,\Bigl(\frac{n}{e}\Bigr)^{n}.
$$

它把组合计数变成连续函数，是信息论、熵与复杂度下界分析的标准工具。

## 9. 常微分方程（简述）

### 9.1 一阶方程

- **可分离变量**：$\dfrac{dy}{dx}=g(x)h(y)\Rightarrow \displaystyle\int\frac{dy}{h(y)}=\int g(x)\,dx$。
- **一阶线性**：$y'+p(x)y=q(x)$，积分因子 $\mu(x)=e^{\int p\,dx}$。

### 9.2 线性系统与矩阵指数

向量形式 $\dot x=Ax$ 的解为 $x(t)=e^{At}x(0)$，其中

$$
e^{At}=\sum_{k=0}^{\infty}\frac{(At)^k}{k!}.
$$

系统渐近稳定当且仅当 $A$ 的所有特征值实部为负。这一框架用于分析动力系统、RNN 稳定性，也是 **Neural ODE** 与残差网络（把离散层数取极限）的理论基础。

## 10. 速查与教材

**最值得记住的几条**

- 链式法则：$\dfrac{d}{dx}f(g(x))=f'(g(x))g'(x)$，反向传播就是它的高维版本。
- 泰勒：$f(x+\Delta)\approx f(x)+\nabla f^{\top}\Delta+\tfrac12\Delta^{\top}H\Delta$。
- 梯度下降收敛速率由条件数 $\kappa=L/\mu$ 控制。
- $\displaystyle\int_{-\infty}^{\infty}e^{-x^2/2}dx=\sqrt{2\pi}$。
- 凸问题：驻点即全局最优；KKT 是约束最优的统一条件。

**推荐教材**

- Stewart，《Calculus》——单变量与多元微积分的标准入门。
- Rudin，《Principles of Mathematical Analysis》——分析学严谨版本。
- Boyd & Vandenberghe，《Convex Optimization》——凸优化与 KKT 的权威参考（官网可免费下载）。
- Magnus & Neudecker，《Matrix Differential Calculus》——矩阵微积分系统参考。
- Nocedal & Wright，《Numerical Optimization》——梯度法、牛顿法与拟牛顿的数值细节。
