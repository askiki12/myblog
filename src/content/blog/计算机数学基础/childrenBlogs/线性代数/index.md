---
title: 线性代数
description: 面向计算机科研的线性代数速查：向量空间与四个基本子空间、矩阵分解（LU/QR/Cholesky/特征/SVD）、正交与最小二乘、特征值与谱定理、二次型与正定性、矩阵微积分及数值要点。
pubDate: 2026-10-03
tags: ['数学', '线性代数', '矩阵', '机器学习']
---

线性代数是计算机科学中“表示与变换”的语言。数据的每一列是向量，神经网络的每一层是关于权重矩阵的线性映射加非线性，图、推荐、降维、注意力机制背后都归结为矩阵分解与特征结构。本文按“科研够用”组织：从向量空间与子空间出发，经过正交与最小二乘、特征值与 SVD，再到二次型、矩阵微积分与数值要点。

## 1. 为什么计算机研究需要线性代数

- **数据表示**：$n$ 个样本、$d$ 个特征构成矩阵 $X\in\mathbb{R}^{n\times d}$；一张灰度图、一段序列都可张成向量空间。
- **模型表达**：全连接层是 $y=Wx+b$，卷积是稀疏结构化矩阵乘法，注意力是 $\operatorname{softmax}(QK^{\top}/\sqrt{d})V$。
- **降维与压缩**：PCA、SVD、低秩近似把高维数据投影到少数主方向。
- **图与网络**：邻接矩阵、拉普拉斯矩阵的特征值刻画连通性、聚类与扩散。
- **理论工具**：条件数、秩、奇异值决定了问题的可解性与数值稳定性。

## 2. 向量空间与子空间

### 2.1 向量空间与基

域 $\mathbb{F}$（通常为 $\mathbb{R}$ 或 $\mathbb{C}$）上的向量空间 $V$ 对加法与数乘封闭。给定向量组 $v_1,\dots,v_k$：

- **线性组合**：$\sum_i c_i v_i$；
- **张成（span）**：所有线性组合构成的集合，记 $\operatorname{span}\{v_1,\dots,v_k\}$；
- **线性无关**：$\sum_i c_i v_i=0$ 只有 $c_i$ 全为 $0$ 的解；
- **基**：张成 $V$ 的线性无关组；基的势称为**维数** $\dim V$。

同一个向量在不同基下的坐标通过**基变换**（可逆矩阵）联系。

### 2.2 四个基本子空间

设 $A\in\mathbb{R}^{m\times n}$：

| 名称 | 记号 | 定义 | 所在空间 | 维数 |
| --- | --- | --- | --- | --- |
| 列空间 | $\mathcal{C}(A)$ | $\{Ax: x\in\mathbb{R}^n\}$ | $\mathbb{R}^m$ | $r$ |
| 零空间 | $\mathcal{N}(A)$ | $\{x: Ax=0\}$ | $\mathbb{R}^n$ | $n-r$ |
| 行空间 | $\mathcal{C}(A^{\top})$ | $\{A^{\top}y: y\in\mathbb{R}^m\}$ | $\mathbb{R}^n$ | $r$ |
| 左零空间 | $\mathcal{N}(A^{\top})$ | $\{y: A^{\top}y=0\}$ | $\mathbb{R}^m$ | $m-r$ |

其中 $r=\operatorname{rank}(A)$。有以下正交关系：

$$
\mathcal{C}(A)^{\perp}=\mathcal{N}(A^{\top}),\qquad
\mathcal{C}(A^{\top})^{\perp}=\mathcal{N}(A).
$$

**秩-零化度定理**：

$$
\dim\mathcal{N}(A)+\operatorname{rank}(A)=n,\qquad
\dim\mathcal{N}(A^{\top})+\operatorname{rank}(A)=m.
$$

**秩的性质**：$\operatorname{rank}(AB)\le\min(\operatorname{rank}A,\operatorname{rank}B)$；$A$ 可逆时左乘/右乘不改变秩。

## 3. 矩阵与线性映射

矩阵 $A\in\mathbb{R}^{m\times n}$ 就是线性映射 $x\mapsto Ax$。矩阵乘法对应映射的复合；这解释了为什么 $m\times n$ 与 $n\times p$ 才能相乘。

### 3.1 基本运算

设 $A,B,C$ 形状相容：

$$
(AB)^{\top}=B^{\top}A^{\top},\qquad
(AB)^{-1}=B^{-1}A^{-1}\ (\text{可逆时}),\qquad
(AB)C=A(BC).
$$

**逆**存在的等价条件：$\det A\neq 0$；$A$ 列满秩；$Ax=0$ 只有零解；$A$ 的特征值全非零。

### 3.2 迹

**迹** $\operatorname{tr}(A)=\sum_i A_{ii}$，满足：

$$
\operatorname{tr}(A+B)=\operatorname{tr}A+\operatorname{tr}B,\qquad
\operatorname{tr}(cA)=c\operatorname{tr}A,\qquad
\operatorname{tr}(AB)=\operatorname{tr}(BA).
$$

循环性质：$\operatorname{tr}(ABC)=\operatorname{tr}(BCA)=\operatorname{tr}(CAB)$。迹还等于特征值之和：

$$
\operatorname{tr}(A)=\sum_{i=1}^{n}\lambda_i,\qquad
\det(A)=\prod_{i=1}^{n}\lambda_i .
$$

### 3.3 特殊矩阵

- **对称**：$A=A^{\top}$；**反对称**：$A=-A^{\top}$。
- **正交**：$Q^{\top}Q=QQ^{\top}=I$，即 $Q^{-1}=Q^{\top}$，保持内积与长度。
- **对角/三角**：对角阵 $\operatorname{diag}(d_1,\dots,d_n)$；上下三角阵。
- **正定**：见第 9 节。
- **稀疏 / Toeplitz / 循环矩阵**：结构可利用快速算法（FFT、迭代法）。

## 4. 线性方程组与消元

考虑 $Ax=b$，$A\in\mathbb{R}^{m\times n}$。

- 有解当且仅当 $b\in\mathcal{C}(A)$；
- 若 $A$ 列满秩（$r=n$），解至多一个；若 $r<n$，解集为
$$
x=x_p+x_h,\qquad x_h\in\mathcal{N}(A),
$$
即“特解 + 零空间”。

**高斯消元**通过初等行变换化为行阶梯形，回代求解。带部分主元的 **LU 分解** $PA=LU$（$P$ 为置换矩阵）把求解拆成前代与回代，适合多次右端项；复杂度 $O(n^3)$。

## 5. 行列式

行列式是唯一满足“多重线性、交替、规范”的标量函数，可由 Leibniz 公式定义：

$$
\det(A)=\sum_{\sigma\in S_n}\operatorname{sgn}(\sigma)\prod_{i=1}^{n}A_{i,\sigma(i)} .
$$

**关键性质**：

$$
\det(AB)=\det A\cdot\det B,\qquad
\det(A^{\top})=\det A,\qquad
\det(A^{-1})=\frac{1}{\det A}.
$$

几何意义：$|\det A|$ 是 $A$ 的列向量张成的平行体的（$n$ 维）体积；$\det A=0$ 表示列线性相关、映射降维、不可逆。

**余子式展开**：沿第 $i$ 行 $\det A=\sum_j(-1)^{i+j}A_{ij}M_{ij}$，其中 $M_{ij}$ 是删去第 $i$ 行第 $j$ 列后的子式。**Cramer 法则**用行列式给出唯一解，但计算量 $O(n!)$ 或 $O(n^4)$，实践中不用，仅用于理论推导。

## 6. 内积、范数与正交

### 6.1 内积与范数

标准内积 $\langle x,y\rangle=x^{\top}y=\sum_i x_i y_i$。诱导的 $p$-范数

$$
\|x\|_p=\Bigl(\sum_i|x_i|^p\Bigr)^{1/p},\qquad
\|x\|_2=\sqrt{x^{\top}x},\qquad
\|x\|_\infty=\max_i|x_i| .
$$

**Cauchy–Schwarz 不等式**：$|\langle x,y\rangle|\le\|x\|_2\|y\|_2$，等号当且仅当 $x,y$ 线性相关。由此定义夹角 $\cos\theta=\dfrac{\langle x,y\rangle}{\|x\|\|y\|}$。

**矩阵范数**：Frobenius 范数 $\|A\|_F=\sqrt{\sum_{ij}A_{ij}^2}$；谱范数 $\|A\|_2=\sigma_{\max}(A)$（最大奇异值）。

### 6.2 正交、标准正交基与 QR

两向量正交指 $\langle x,y\rangle=0$。**标准正交组**满足 $q_i^{\top}q_j=\delta_{ij}$。

**Gram–Schmidt** 过程把线性无关组 $a_1,\dots,a_k$ 变成标准正交组：先减去在已有方向上的投影再归一化：

$$
q_i=\frac{a_i-\sum_{j<i}\langle a_i,q_j\rangle q_j}{\bigl\|a_i-\sum_{j<i}\langle a_i,q_j\rangle q_j\bigr\|}.
$$

写成矩阵即 **QR 分解** $A=QR$，$Q$ 列标准正交，$R$ 上三角。

### 6.3 正交投影与最小二乘

把向量 $b$ 投影到子空间 $\mathcal{C}(A)$ 上的**投影矩阵**

$$
P=A(A^{\top}A)^{-1}A^{\top},
$$

满足 $P^2=P=P^{\top}$。最小二乘问题 $\min_x\|Ax-b\|_2^2$ 的解满足**正规方程**

$$
A^{\top}Ax=A^{\top}b .
$$

当 $A$ 列满秩时 $x=(A^{\top}A)^{-1}A^{\top}b$；否则用**伪逆**（见 SVD）给出最小范数解。数值上更稳的做法是对 $A$ 做 QR 分解后解 $Rx=Q^{\top}b$。

## 7. 特征值与特征向量

### 7.1 定义与对角化

非零向量 $v$ 与标量 $\lambda$ 满足

$$
Av=\lambda v
$$

时，$v$ 为**特征向量**，$\lambda$ 为**特征值**。特征值是**特征多项式** $p(\lambda)=\det(A-\lambda I)$ 的根。

若 $A$ 有 $n$ 个线性无关的特征向量，则**可对角化**：

$$
A=V\Lambda V^{-1},\qquad \Lambda=\operatorname{diag}(\lambda_1,\dots,\lambda_n).
$$

一般地，相似矩阵 $A\sim B=M^{-1}AM$ 具有相同的特征值。不能对角化时可用 **Jordan 标准形**。

### 7.2 对称矩阵与谱定理

实对称矩阵 $A=A^{\top}$ 的**谱定理**：

$$
A=Q\Lambda Q^{\top},\qquad Q^{\top}Q=I,
$$

即存在标准正交特征基，且所有特征值实。若特征值全为正，则 $A$ 正定（第 9 节）。一般矩阵的**奇异值分解**（第 8 节）可视为谱定理对非方阵的推广。

### 7.3 谱半径与幂迭代

**谱半径** $\rho(A)=\max_i|\lambda_i|$。Gelfand 公式给出 $\rho(A)=\lim_{k\to\infty}\|A^k\|^{1/k}$；$\rho(A)<1$ 保证迭代 $x_{k+1}=Ax_k$ 收敛到零。

**幂迭代**反复 $x_{k+1}=Ax_k/\|Ax_k\|$，收敛到模最大的特征向量，收敛速率由 $|\lambda_2/\lambda_1|$ 决定。它是 PageRank、谱聚类等的主特征向量算法的核心。

## 8. 矩阵分解

矩阵分解是把复杂矩阵拆成简单结构，是数值线性代数与机器学习的骨架。

### 8.1 常见分解

| 分解 | 形式 | 条件 | 用途 |
| --- | --- | --- | --- |
| LU | $PA=LU$ | 方阵 | 解方程组、行列式 |
| QR | $A=QR$ | 任意 | 最小二乘、正交化 |
| Cholesky | $A=LL^{\top}$ | 对称正定 | 高效求解、采样 |
| 特征分解 | $A=V\Lambda V^{-1}$ | 可对角化 | 动力系统、谱分析 |
| SVD | $A=U\Sigma V^{\top}$ | 任意 | 降维、伪逆、低秩 |

### 8.2 奇异值分解（SVD）

任意 $A\in\mathbb{R}^{m\times n}$ 都可分解为

$$
A=U\Sigma V^{\top},\qquad
U\in\mathbb{R}^{m\times m},\ V\in\mathbb{R}^{n\times n}\ \text{正交},\
\Sigma\in\mathbb{R}^{m\times n}\ \text{对角}.
$$

对角元 $\sigma_1\ge\sigma_2\ge\cdots\ge0$ 为**奇异值**，满足

$$
\sigma_i=\sqrt{\lambda_i(A^{\top}A)}=\sqrt{\lambda_i(AA^{\top})}.
$$

**性质**：

- $\operatorname{rank}(A)=$ 非零奇异值个数；
- $\|A\|_2=\sigma_1$，$\|A\|_F=\sqrt{\sum_i\sigma_i^2}$；
- 条件数 $\kappa(A)=\sigma_{\max}/\sigma_{\min}$（$\sigma_{\min}>0$ 时）；
- **伪逆** $A^{+}=V\Sigma^{+}U^{\top}$，给出最小二乘的最小范数解。

**Eckart–Young 定理**：截断 SVD $A_k=\sum_{i=1}^{k}\sigma_i u_i v_i^{\top}$ 是在秩不超过 $k$ 的矩阵中，在谱范数与 Frobenius 范数下对 $A$ 的最优近似。这是 PCA、图像压缩、推荐系统低秩近似的理论依据。

### 8.3 PCA 与 SVD 的关系

对中心化数据 $X$（每列零均值），主成分方向是 $X^{\top}X$ 的特征向量，也即 $X$ 的右奇异向量。保留前 $k$ 个主方向得到

$$
Z=X V_k,\qquad X\approx Z V_k^{\top},
$$

其中 $V_k$ 是前 $k$ 个右奇异向量。第 $i$ 个主成分解释的方差为 $\sigma_i^2/(n-1)$。

## 9. 二次型与正定性

**二次型** $Q(x)=x^{\top}Ax$（$A$ 对称）。若对一切 $x\neq0$ 有 $x^{\top}Ax>0$，称 $A$ **正定**（$A\succ0$）；$\ge0$ 称**半正定**（$A\succeq0$）。

等价判别：

- 所有特征值 $>0$（半正定则 $\ge0$）；
- Sylvester 判据：所有顺序主子式 $>0$；
- Cholesky 分解 $A=LL^{\top}$ 存在且 $L$ 可逆；
- 对任意 $x\neq0$，$x^{\top}Ax>0$。

**与凸性的联系**：$f(x)=\tfrac12x^{\top}Ax-b^{\top}x$ 的海森矩阵为 $A$；$A\succeq0$ 时 $f$ 凸，$A\succ0$ 时严格凸，因此正定性是判断优化问题凸性与解唯一性的关键。

**广义特征值问题** $Av=\lambda Bv$（$B\succ0$）在 Fisher 判别、CCA 中出现，可化为 $B^{-1/2}AB^{-1/2}$ 的标准特征问题。

## 10. 矩阵微积分速查

以下采用分母布局（梯度为列向量），与《微积分》第 5 节一致：

$$
\frac{\partial\,(a^{\top}x)}{\partial x}=a,\qquad
\frac{\partial\,(x^{\top}Ax)}{\partial x}=(A+A^{\top})x,\qquad
\frac{\partial\,\|x\|_2^2}{\partial x}=2x,
$$
$$
\frac{\partial\,\|Ax-b\|_2^2}{\partial x}=2A^{\top}(Ax-b),\qquad
\frac{\partial\,\operatorname{tr}(AX)}{\partial X}=A^{\top},\qquad
\frac{\partial\,\ln\det X}{\partial X}=X^{-\top}.
$$

这些恒等式直接给出最小二乘、岭回归（增加 $\lambda\|x\|^2$ 项使 $A^{\top}A+\lambda I$ 正定）等问题的梯度。

## 11. 数值线性代数要点

### 11.1 条件数与稳定性

条件数 $\kappa(A)=\|A\|\,\|A^{-1}\|$（2-范数下为 $\sigma_{\max}/\sigma_{\min}$）衡量解对扰动的敏感度：

$$
\frac{\|\delta x\|}{\|x\|}\le\kappa(A)\frac{\|\delta b\|}{\|b\|}.
$$

$\kappa$ 很大时问题**病态**，即使算法稳定，舍入误差也会被放大。实践中用 QR 而非正规方程、用 SVD 求伪逆、对数据做标准化，都是为了控制条件数。

### 11.2 常用运算复杂度

| 运算 | 复杂度 |
| --- | --- |
| 矩阵-向量 $Ax$ | $O(mn)$ |
| 矩阵乘法 $AB$（$m\times n$、$n\times p$） | $O(mnp)$ |
| LU 分解 / 解 $n\times n$ 方程组 | $O(n^3)$ |
| Cholesky 分解 | $O(n^3/3)$ |
| QR 分解（$m\ge n$） | $O(mn^2)$ |
| SVD（$m\ge n$） | $O(mn^2)$ |

大规模稀疏系统常用**迭代法**：幂法求主特征向量；共轭梯度（CG）求解对称正定系统；Lanczos/Arnoldi 求部分特征对；随机化 SVD 加速低秩分解。

## 12. 典型应用

- **最小二乘与线性回归**：正规方程或 QR；加上 $L_2$ 正则即**岭回归** $(X^{\top}X+\lambda I)^{-1}X^{\top}y$。
- **PCA / 降维**：对中心化数据做 SVD，取前 $k$ 个奇异向量。
- **推荐系统 / 矩阵补全**：低秩假设下用 SVD 或交替最小二乘恢复缺失项。
- **谱聚类与图**：图拉普拉斯 $L=D-W$ 的特征向量嵌入节点，最小非零特征值（Fiedler 值）反映连通性。
- **注意力机制**：$\operatorname{softmax}(QK^{\top}/\sqrt{d})V$，其中缩放因子 $\sqrt{d}$ 控制内积方差、避免 softmax 饱和。
- **神经网络**：每层是权重矩阵乘法；权重矩阵的奇异值谱影响梯度爆炸/消失，正交初始化与谱归一化正是针对这点。

## 13. 速查与教材

**最值得记住的几条**

- 秩-零化度定理：$\dim\mathcal{N}(A)+\operatorname{rank}(A)=n$。
- 投影矩阵 $P=A(A^{\top}A)^{-1}A^{\top}$，最小二乘满足 $A^{\top}Ax=A^{\top}b$。
- 对称矩阵可正交对角化 $A=Q\Lambda Q^{\top}$；任意矩阵有 SVD $A=U\Sigma V^{\top}$。
- 截断 SVD 是最优低秩近似（Eckart–Young）。
- 条件数决定数值稳定性；$\kappa=\sigma_{\max}/\sigma_{\min}$。
- 正定 $\Leftrightarrow$ 特征值全正 $\Leftrightarrow$ Cholesky 存在 $\Leftrightarrow$ 二次型恒正。

**推荐教材**

- Strang，《Introduction to Linear Algebra》——几何直观与四个基本子空间，配套 MIT 公开课。
- Trefethen & Bau，《Numerical Linear Algebra》——QR、SVD、条件数与稳定性的现代视角。
- Golub & Van Loan，《Matrix Computations》——数值线性代数的权威参考书。
- Boyd & Vandenberghe，《Convex Optimization》——附录 A 对矩阵与正定性有精炼总结。
- Deisenroth, Faisal & Ong，《Mathematics for Machine Learning》——面向机器学习的线性代数与微积分。
