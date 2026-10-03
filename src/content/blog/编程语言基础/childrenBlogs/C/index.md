---
title: C
description: C 语言学习笔记：系统整理基础语法（词法、数据类型、运算符、控制流、函数、数组、字符串、指针、输入输出）与进阶语法（指针进阶、内存管理、结构体/联合体/枚举、位运算、预处理器、函数指针与回调、文件 I/O、并发编程、多文件编译与常见陷阱）。
pubDate: 2026-10-1
updatedDate: 2026-10-3
tags:
  - 编程语言
---
C 语言是一种通用的高级编程语言，最初由丹尼斯·里奇（Dennis Ritchie）在贝尔实验室为开发 UNIX 操作系统而设计。C 语言于 1972 年在 DEC PDP-11 计算机上首次实现，是现代编程语言体系中最具影响力的语言之一。它的设计目标是**贴近硬件、可移植、高效**，因此被广泛用于操作系统内核、嵌入式、编译器、数据库等底层系统软件。

本文按「基础语法 → 进阶语法」组织，既可作为入门提纲，也可作为日常速查。

## C 基础语法

### 第一个程序

```c
#include <stdio.h>

int main(void)
{
    printf("Hello, World!\n");
    return 0;
}
```

- `#include <stdio.h>`：预处理指令，引入标准输入输出库，`printf` 的声明就在其中。
- `int main(void)`：程序唯一入口。`int` 是返回类型，`void` 表示不接受参数。
- 语句以分号 `;` 结尾，代码块用花括号 `{}` 包裹。
- `return 0;` 表示程序正常结束（非 0 通常表示出错）。

编译与运行：

```bash
gcc hello.c -o hello   # 编译
./hello                # 运行；Windows 下可执行文件为 hello.exe
```

常用编译选项：

```bash
gcc -std=c11 -Wall -Wextra -g hello.c -o hello
```

`-Wall -Wextra` 打开警告（强烈建议），`-g` 生成调试信息，`-O2` 开启优化。

### 词法单元（Tokens）

C 语言的 token 主要包括以下几种类型：

- **关键字（Keywords）**：语言预留的具有特殊含义的单词，如 `int`、`if`、`return`。
- **标识符（Identifiers）**：程序员自定义的名称，用于变量、函数、数组等。
- **常量（Constants）**：程序中固定不变的值，如整数 `42`、浮点数 `3.14`。
- **字符串字面量（String Literals）**：由双引号括起来的字符序列，如 `"Hello"`。
- **运算符（Operators）**：用于执行运算的符号，如 `+`、`==`、`&&`。
- **分隔符（Separators）**：用于分隔语句和代码块的符号，如 `;`、`{}`。

### 注释

```c
// 单行注释（C99 起支持）
/* 多行注释，
   注意不能嵌套 */
```

### 关键字

C 语言的常见关键字可按用途分组：

| 分类 | 关键字 |
|---|---|
| 数据类型 | `char` `short` `int` `long` `float` `double` `void` `signed` `unsigned` `_Bool` `_Complex` |
| 类型限定 | `const` `volatile` `restrict` `_Atomic` |
| 存储类 | `auto` `static` `extern` `register` `_Thread_local` |
| 控制流 | `if` `else` `switch` `case` `default` `for` `while` `do` `break` `continue` `goto` `return` |
| 结构相关 | `struct` `union` `enum` `typedef` `sizeof` |
| 其他 | `inline` `_Noreturn` `_Generic` `_Static_assert` `_Alignas` `_Alignof` |

### 标识符命名规则

- 只能由字母、数字和下划线组成，且**不能以数字开头**。
- 区分大小写：`count` 与 `Count` 是两个名字。
- 不能与关键字同名。
- 以双下划线开头、或下划线加大写字母开头的名字（如 `__foo`、`_Bar`）保留给实现，避免使用。

### 数据类型

基本类型的典型大小与取值范围如下（**具体大小取决于平台和编译器**，应始终用 `sizeof` 而非假设）：

|类型|存储大小|值范围|
|---|---|---|
|char|1 字节|-128 到 127 或 0 到 255|
|unsigned char|1 字节|0 到 255|
|signed char|1 字节|-128 到 127|
|int|2 或 4 字节|-32,768 到 32,767 或 -2,147,483,648 到 2,147,483,647|
|unsigned int|2 或 4 字节|0 到 65,535 或 0 到 4,294,967,295|
|short|2 字节|-32,768 到 32,767|
|unsigned short|2 字节|0 到 65,535|
|long|4 或 8 字节|-2,147,483,648 到 2,147,483,647（或更大）|
|unsigned long|4 或 8 字节|0 到 4,294,967,295（或更大）|
|long long|8 字节|至少 ±9.2 × 10¹⁸|
|float|4 字节|约 ±3.4 × 10³⁸（6~7 位有效数字）|
|double|8 字节|约 ±1.7 × 10³⁰⁸（15~16 位有效数字）|
|long double|8/12/16 字节|实现相关|

补充说明：

- `char` 的大小恒为 **1 字节**，是 C 中所有对象大小的基本单位。
- `signed` / `unsigned` 只修饰整型。默认的 `char` 是否有符号由实现决定。
- `void` 表示「无类型」：`void f(void)` 表示无参数，`void *p` 表示通用指针。
- C99 的 `_Bool` 配合 `#include <stdbool.h>` 可写作 `bool`，取值 `true` / `false`。
- 需要精确位宽时使用 `#include <stdint.h>` 提供的 `int8_t`、`uint16_t`、`int32_t`、`uint64_t` 等。
- `size_t` 用于表示对象大小，是无符号整型；打印用 `%zu`。

### 变量与常量

```c
int a = 10;          // 声明并初始化
int b, c = 3;        // b 未初始化，c 为 3
const double PI = 3.14159;   // 只读变量
#define MAX 100      // 宏常量（预处理阶段文本替换）
```

- **声明**告诉编译器变量的类型和名字；**定义**才会真正分配存储。
- 局部变量若未初始化，其值是**不确定的**（可能是垃圾值），务必显式初始化。
- `const` 表示只读，具有类型检查；`#define` 只是文本替换，没有类型与作用域。

字面量后缀：`10u`（无符号）、`10L`（long）、`10LL`（long long）、`3.14f`（float）、`3.14`（double）。整数可用 `0x`（十六进制）、`0`（八进制）、`0b`（二进制，GCC 扩展）表示。

### 运算符

| 分类 | 运算符 | 说明 |
|---|---|---|
| 算术 | `+` `-` `*` `/` `%` `++` `--` | `%` 只能用于整数 |
| 关系 | `<` `<=` `>` `>=` `==` `!=` | 结果为 0（假）或 1（真） |
| 逻辑 | `!` `&&` `\|\|` | 具有短路求值 |
| 位运算 | `~` `&` `\|` `^` `<<` `>>` | 按二进制位操作 |
| 赋值 | `=` `+=` `-=` `*=` `/=` `%=` `&=` `\|=` `^=` `<<=` `>>=` | |
| 其他 | `?:` `sizeof` `&` `*` `.` `->` `,` `(type)` | 三目、取址/解引用、成员访问、逗号、强制转换 |

要点：

- **整数除法会截断**：`7 / 2 == 3`；要得到小数需至少一个操作数为浮点。
- `&&` 与 `||` 会**短路**：`a != 0 && b / a > 1` 中若 `a` 为 0，右侧不会执行。
- 前缀 `++x` 先加再用，后缀 `x++` 先用再加。
- 赋值 `=` 与比较 `==` 极易写错，且 `if (x = 0)` 合法但几乎总是 bug。
- 优先级复杂，建议对不确定的表达式加括号。

常见优先级（从高到低，节选）：

1. `()` `[]` `->` `.`
2. `!` `~` `++` `--` `(type)` `sizeof` `*` `&`（一元）
3. `*` `/` `%`
4. `+` `-`
5. `<<` `>>`
6. `<` `<=` `>` `>=`
7. `==` `!=`
8. `&`
9. `^`
10. `|`
11. `&&`
12. `||`
13. `?:`
14. `=` 及复合赋值
15. `,`

### 类型转换

```c
int i = 3.7;            // 隐式：截断为 3
double d = i;           // 隐式：整型转浮点
double e = (double)i / 2;  // 显式强制转换，结果为 1.5；否则 3/2 == 1
```

- **隐式转换（整型提升/算术转换）**：运算前，小于 `int` 的类型会提升为 `int`；不同类型混用时向「更高」的类型转换。
- **显式转换（强制类型转换）**：`(type)expr`，由程序员负责，可能丢失精度。
- **陷阱**：有符号与无符号混用会按无符号解释。例如 `-1 < 0u` 为假，因为 `-1` 被转换为很大的无符号数。

### 控制流

```c
// if / else if / else
if (score >= 90) {
    grade = 'A';
} else if (score >= 60) {
    grade = 'P';
} else {
    grade = 'F';
}

// switch：注意 break，否则会贯穿（fall-through）
switch (ch) {
    case 'a':
    case 'A':
        puts("A");
        break;
    default:
        puts("other");
        break;
}

// while
while (n > 0) { n--; }

// do-while：至少执行一次
do { n++; } while (n < 10);

// for：初始化; 条件; 迭代表达式
for (int i = 0; i < 10; i++) { /* ... */ }

// break 跳出循环；continue 进入下一次迭代
// goto 用于跳出多层循环或统一清理，谨慎使用
```

### 函数

```c
// 声明（原型）：告诉编译器签名
int add(int a, int b);

// 定义
int add(int a, int b)
{
    return a + b;
}

int main(void)
{
    int sum = add(1, 2);
    return 0;
}
```

- **声明与定义分离**：函数可先声明后使用；声明通常放在头文件。
- **参数按值传递**：函数收到的是实参的副本，修改形参不影响实参；要修改实参需传指针。
- `return` 结束函数并返回值；`void` 函数可不写 `return`。
- **递归**：函数调用自身，必须有终止条件。例如：

```c
long factorial(int n)
{
    return n <= 1 ? 1 : n * factorial(n - 1);
}
```

### 数组

```c
int a[5] = {1, 2, 3, 4, 5};   // 初始化
int b[5] = {0};               // 全部置 0
int c[]  = {1, 2, 3};         // 长度由初始化推导为 3
int m[2][3] = {{1, 2, 3}, {4, 5, 6}};  // 二维数组

size_t n = sizeof(a) / sizeof(a[0]);   // 元素个数
```

- 下标从 0 开始，合法范围是 `0 .. n-1`。**越界访问不会报错**，但属于未定义行为，可能破坏内存。
- 数组名在多数表达式中会**退化为指向首元素的指针**，因此不能直接对数组整体赋值，`sizeof(arr)` 在函数内部也不等于原数组大小。
- 数组作为函数参数时退化为指针，通常还需额外传入长度。

### 字符串

C 没有原生的字符串类型，字符串是**以 `'\0'` 结尾的字符数组**。

```c
char s1[] = "hello";          // 可修改，长度 6（含 '\0'）
const char *s2 = "hello";     // 指向字面量，不应修改
char s3[10] = "hi";           // 其余元素自动补 '\0'
```

常用 `<string.h>` 函数：

| 函数 | 作用 |
|---|---|
| `strlen(s)` | 返回长度（不含 `'\0'`） |
| `strcpy(dst, src)` / `strncpy` | 复制 |
| `strcat(dst, src)` / `strncat` | 拼接 |
| `strcmp(a, b)` / `strncmp` | 比较，0 表示相等 |
| `strchr(s, c)` / `strstr(s, sub)` | 查找字符 / 子串 |
| `memset`, `memcpy`, `memmove` | 按字节填充 / 复制 |

安全提示：`strcpy`/`strcat`/`gets` 不做边界检查，容易**缓冲区溢出**；优先使用带长度的版本，输入用 `fgets` 而非 `gets`。

### 指针基础

```c
int x = 42;
int *p = &x;      // p 保存 x 的地址
printf("%d\n", *p);   // *p 解引用，得到 42
*p = 7;           // 通过指针修改 x

int *q = NULL;    // 空指针，解引用前必须检查
```

- `&x` 取地址，`*p` 解引用（访问所指对象）。
- 指针有类型：`int *` 与 `char *` 的算术步长不同。
- 指针算术以「所指类型的大小」为单位：`p + 1` 前进 `sizeof(*p)` 字节。
- 数组名可看作指向首元素的指针：`a[i]` 等价于 `*(a + i)`。
- 未初始化或悬空的指针（野指针）解引用是未定义行为。

### 输入输出

```c
int n;
char name[32];
printf("n=%d, hex=%x, float=%.2f\n", n, n, 3.14159);
scanf("%d", &n);          // 注意：基本类型需要取地址
fgets(name, sizeof name, stdin);   // 读取一行，比 gets 安全
```

`printf` 常用格式符：

| 格式 | 类型 | 格式 | 类型 |
|---|---|---|---|
| `%d` / `%i` | int | `%f` / `%lf` | float / double |
| `%u` | unsigned | `%e` | 科学计数法 |
| `%ld` / `%lld` | long / long long | `%c` | char |
| `%x` / `%o` | 十六进制 / 八进制 | `%s` | 字符串 |
| `%zu` | size_t | `%p` | 指针地址 |
| `%hd` | short | `%%` | 百分号本身 |

常用转义字符：`\n` 换行、`\t` 制表、`\\` 反斜杠、`\"` 双引号、`\0` 空字符、`\x41`（十六进制字符）。

## C 进阶语法

### 指针进阶

**指针数组 vs 数组指针**

```c
int *a[10];     // 指针数组：a 是数组，含 10 个 int*
int (*b)[10];   // 数组指针：b 是指针，指向含 10 个 int 的数组
```

**指向指针的指针**

```c
int x = 1;
int *p = &x;
int **pp = &p;
**pp = 2;       // 等价于 x = 2
```

**const 与指针的三种组合**

```c
const int *p1;        // 指向常量的指针：不能通过 p1 改值，p1 本身可改指向
int * const p2 = &x;  // 常量指针：p2 不可改指向，但可通过它改值
const int * const p3 = &x;  // 两者都不可改
```

记忆口诀：从变量名出发，由内向外、从右向左读。`int * const p` 中 `const` 紧靠 `p`，所以指针本身是常量。

**函数指针与回调**

```c
int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }

int (*op)(int, int) = add;   // 函数指针
int r = op(3, 2);            // 通过指针调用

// 回调：把函数作为参数传入
void apply(int *arr, int n, int (*f)(int, int))
{
    for (int i = 1; i < n; i++)
        arr[0] = f(arr[0], arr[i]);
}
apply(data, n, add);
```

标准库 `qsort` 是函数指针的经典应用：

```c
#include <stdlib.h>

int cmp_int(const void *a, const void *b)
{
    int x = *(const int *)a;
    int y = *(const int *)b;
    return (x > y) - (x < y);   // 安全的比较写法，避免溢出
}

qsort(arr, n, sizeof arr[0], cmp_int);
```

**void 指针**：`void *` 可存放任意对象指针，赋给其他指针类型无需显式转换，但**不能解引用**、不能做算术（GCC 允许扩展）。

### 内存管理

C 程序的内存布局（从低地址到高地址）：

| 区域 | 内容 | 生命周期 |
|---|---|---|
| 代码段 text | 机器指令、字面量 | 整个程序 |
| 数据段 data | 已初始化的全局/静态变量 | 整个程序 |
| BSS 段 | 未初始化的全局/静态变量（自动置 0） | 整个程序 |
| 堆 heap | `malloc`/`free` 动态分配 | 由程序员控制 |
| 栈 stack | 局部变量、函数调用帧 | 函数返回即失效 |

```c
#include <stdlib.h>

int *p = malloc(n * sizeof *p);   // 分配 n 个 int
if (p == NULL) {
    /* 分配失败，处理错误 */
}

p = realloc(p, m * sizeof *p);    // 扩容/缩容，失败时原指针仍有效
int *q = calloc(n, sizeof *q);    // 分配并清零

free(p);   // 释放
p = NULL;  // 避免悬空指针
```

- `malloc` 返回 `void*`，失败返回 `NULL`，**必须检查**。
- `realloc` 失败时返回 `NULL` 且原内存未被释放，不要把返回值直接赋给原指针。

常见内存错误：

- **内存泄漏**：分配后未 `free`，程序运行期间内存持续增长。
- **重复释放（double free）**：对同一块内存调用两次 `free`。
- **释放后使用（use-after-free）**：`free` 后仍访问该指针。
- **越界写**：写入超出分配大小的位置，破坏堆结构。
- **返回局部变量地址**：函数返回后栈内存失效，指针悬空。

调试工具：`valgrind`（Linux）、AddressSanitizer（`-fsanitize=address`）、`-Wall -Wextra`。

### 结构体、联合体、枚举与位域

**结构体 struct**

```c
struct Point {
    int x;
    int y;
};

struct Point p = {1, 2};
p.x = 3;
struct Point *pp = &p;
int y = pp->y;        // 指针用 -> 访问成员
```

自引用结构体用于构建链表、树等：

```c
struct Node {
    int value;
    struct Node *next;
};
```

**typedef**：为类型取别名，常与结构体连用：

```c
typedef struct {
    int x, y;
} Point;

Point p = {1, 2};
```

**内存对齐与填充**：编译器会在成员之间插入填充字节，使每个成员地址满足对齐要求，因此 `sizeof(struct)` 可能大于成员大小之和。可用 `#pragma pack` 或 `__attribute__((packed))` 改变（可能降低性能）。`offsetof(struct S, member)` 可获取成员偏移。

**联合体 union**：所有成员共享同一块内存，大小等于最大成员，同一时刻只有一个成员有效。

```c
union Value {
    int i;
    float f;
    char bytes[4];
};
```

**枚举 enum**：一组具名整型常量。

```c
enum Color { RED, GREEN = 5, BLUE };   // RED=0, GREEN=5, BLUE=6
```

**位域**：在结构体中按位分配字段，用于紧凑存储。

```c
struct Flags {
    unsigned int a : 1;   // 占 1 位
    unsigned int b : 3;   // 占 3 位
    unsigned int   : 0;   // 强制从下一个存储单元开始
};
```

### 位运算进阶

```c
// 常用操作
x |=  (1u << n);      // 置位
x &= ~(1u << n);      // 清位
x ^=  (1u << n);      // 取反某位
int bit = (x >> n) & 1u;   // 取第 n 位

// 掩码与宏
#define BIT(n)  (1u << (n))
#define SET(x, n)   ((x) |= BIT(n))
#define CLEAR(x, n) ((x) &= ~BIT(n))
#define GET(x, n)   (((x) >> (n)) & 1u)
```

要点：

- `<<`/`>>` 对负数或超出位宽是未定义行为，移位量必须小于类型位宽。
- `>>` 对负数是有符号右移，行为由实现定义（通常算术移位）。
- **字节序（endianness）**：小端（x86）低位字节存低地址，大端相反。网络字节序为大端，用 `htonl`/`ntohl` 转换。

### 预处理器

```c
// 对象宏与函数宏：参数务必加括号
#define PI 3.14159
#define MAX(a, b)  ((a) > (b) ? (a) : (b))
#define SQUARE(x)  ((x) * (x))

// 字符串化与记号粘贴
#define STR(x)   #x
#define CONCAT(a, b)  a##b

// 条件编译
#ifdef DEBUG
    printf("debug\n");
#endif

#ifndef HEADER_H
#define HEADER_H
/* 头文件内容：include guard，防止重复包含 */
#endif

#if defined(__linux__) || defined(__APPLE__)
    ...
#endif
```

- 函数宏的副作用陷阱：`SQUARE(i++)` 会展开成 `((i++) * (i++))`，导致 `i` 自增两次。能用 `static inline` 函数时优先用函数。
- 预定义宏：`__FILE__`、`__LINE__`、`__func__`、`__DATE__`、`__TIME__`、`__STDC_VERSION__`。
- `#pragma once` 也能防止重复包含，但非标准；`include guard` 可移植性更好。

### 函数进阶

**可变参数函数**（`<stdarg.h>`）：

```c
#include <stdarg.h>

int sum(int count, ...)
{
    va_list ap;
    va_start(ap, count);
    int total = 0;
    for (int i = 0; i < count; i++)
        total += va_arg(ap, int);
    va_end(ap);
    return total;
}
```

`va_arg` 必须知道实际类型；调用方与函数对类型/数量的约定必须一致（如 `printf` 靠格式串）。

**inline 函数**：建议编译器内联展开，减少调用开销；通常放在头文件中，配合 `static inline` 避免多重定义。

**static 函数**：只在当前翻译单元可见，避免符号冲突。

### 作用域、链接与存储期

| 存储类 | 说明 |
|---|---|
| `auto` | 默认的局部变量，可省略 |
| `register` | 建议放入寄存器（现代编译器通常忽略） |
| `static` | 局部：生命周期延长到程序结束，只在首次初始化；全局/函数：内部链接，仅本文件可见 |
| `extern` | 声明外部变量/函数，定义在别处 |

```c
void counter(void)
{
    static int n = 0;   // 只初始化一次，跨调用保留
    n++;
    printf("%d\n", n);
}
```

作用域（scope）决定名字可见范围；链接（linkage）决定符号能否跨文件访问；存储期（storage duration）决定对象何时存在。三者相互独立，不要混淆。

### 文件 I/O

```c
#include <stdio.h>

FILE *fp = fopen("data.txt", "r");
if (fp == NULL) {
    perror("fopen");   // 打印错误原因
    return 1;
}

char line[256];
while (fgets(line, sizeof line, fp) != NULL)
    fputs(line, stdout);

fclose(fp);
```

文件打开模式：

| 模式 | 含义 |
|---|---|
| `"r"` | 只读，文件必须存在 |
| `"w"` | 只写，截断或创建 |
| `"a"` | 追加 |
| `"r+"` | 读写，文件必须存在 |
| `"w+"` | 读写，截断或创建 |
| `"rb"` `"wb"` | 二进制模式（Windows 下需加 `b`） |

常用函数：

- 字符/行/格式化：`fgetc`、`fputc`、`fgets`、`fputs`、`fprintf`、`fscanf`。
- 二进制块：`fread`、`fwrite`。
- 定位：`fseek`、`ftell`、`rewind`。
- 状态与刷新：`feof`、`ferror`、`clearerr`、`fflush`。
- 关闭：`fclose`。

```c
// 二进制读写示例
size_t written = fwrite(arr, sizeof arr[0], n, fp);
fseek(fp, 0, SEEK_SET);          // 回到开头
size_t read = fread(buf, sizeof buf[0], n, fp);
```

标准流：`stdin`、`stdout`、`stderr`，分别对应标准输入、输出和错误输出。

### 并发编程

C 标准在很长一段时间内没有并发支持，**C11 才引入 `<threads.h>` 与 `<stdatomic.h>`**。实际工程中存在多种方案：

- **C11 线程**（`<threads.h>`）：标准、可移植，但部分旧编译器/运行时不完整（glibc 2.28+ 支持）。
- **POSIX 线程（pthreads）**：Linux/macOS 的事实标准，功能最全，编译需加 `-pthread`。
- **Windows 线程 API**：`CreateThread`、`CRITICAL_SECTION`、`WaitForSingleObject` 等。

并发的核心问题只有一个：**多个线程同时访问共享可变数据**。解决手段有两类——用锁（mutex）做互斥，或用原子操作（atomic）做无锁同步。

#### C11 线程入门

```c
#include <stdio.h>
#include <threads.h>

mtx_t lock;
long counter = 0;

int worker(void *arg)
{
    (void)arg;
    for (int i = 0; i < 100000; ++i) {
        mtx_lock(&lock);        // 进入临界区
        counter++;              // 只有持锁线程能执行
        mtx_unlock(&lock);      // 离开临界区
    }
    return 0;
}

int main(void)
{
    thrd_t t1, t2;
    mtx_init(&lock, mtx_plain);

    thrd_create(&t1, worker, NULL);
    thrd_create(&t2, worker, NULL);
    thrd_join(t1, NULL);        // 等待线程结束
    thrd_join(t2, NULL);

    mtx_destroy(&lock);
    printf("counter = %ld\n", counter);   // 200000
    return 0;
}
```

```bash
gcc -std=c11 -pthread thread_demo.c -o thread_demo
```

`<threads.h>` 常用接口：

| 类别 | 接口 |
|---|---|
| 线程 | `thrd_create` `thrd_join` `thrd_detach` `thrd_current` `thrd_sleep` `thrd_yield` |
| 互斥量 | `mtx_init` `mtx_lock` `mtx_trylock` `mtx_unlock` `mtx_destroy` |
| 条件变量 | `cnd_init` `cnd_wait` `cnd_signal` `cnd_broadcast` `cnd_destroy` |
| 一次性初始化 | `once_flag` `call_once` |
| 线程局部存储 | `tss_t` `tss_create` `tss_get` `tss_set` |

#### POSIX 线程（pthreads）

```c
#include <pthread.h>
#include <stdio.h>

pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;
long counter = 0;

void *worker(void *arg)
{
    (void)arg;
    for (int i = 0; i < 100000; ++i) {
        pthread_mutex_lock(&lock);
        counter++;
        pthread_mutex_unlock(&lock);
    }
    return NULL;
}

int main(void)
{
    pthread_t t1, t2;
    pthread_create(&t1, NULL, worker, NULL);
    pthread_create(&t2, NULL, worker, NULL);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);
    printf("counter = %ld\n", counter);
    return 0;
}
```

```bash
gcc -pthread pthread_demo.c -o pthread_demo
```

pthreads 还提供读写锁 `pthread_rwlock_t`、自旋锁 `pthread_spinlock_t`、屏障 `pthread_barrier_t`、线程局部存储 `pthread_key_t` 等。

**条件变量**用于「等待某个条件成立」，必须配合互斥量使用，典型场景是生产者–消费者：

```c
pthread_mutex_t mtx = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t  cond = PTHREAD_COND_INITIALIZER;
int ready = 0;

// 等待方
pthread_mutex_lock(&mtx);
while (!ready)                       // 用 while 防止虚假唤醒
    pthread_cond_wait(&cond, &mtx);  // 原子地释放锁并睡眠，唤醒后重新加锁
pthread_mutex_unlock(&mtx);

// 通知方
pthread_mutex_lock(&mtx);
ready = 1;
pthread_cond_signal(&cond);          // 唤醒一个等待者
pthread_mutex_unlock(&mtx);
```

#### 原子操作与内存序

`<stdatomic.h>` 提供原子类型与操作，无需加锁即可保证单个操作不可分割：

```c
#include <stdatomic.h>

atomic_int counter = 0;

atomic_fetch_add(&counter, 1);        // 原子自增
int v = atomic_load(&counter);        // 原子读
atomic_store(&counter, 0);            // 原子写

// CAS（比较并交换）：无锁算法的基础
int expected = 5;
int desired  = 6;
atomic_compare_exchange_strong(&counter, &expected, desired);
```

`_Atomic` 也可作类型限定符：`_Atomic int x;`。

**内存序（memory order）**控制原子操作周围的内存可见性，默认 `memory_order_seq_cst`（顺序一致，最安全也最慢）：

| 内存序 | 含义 |
|---|---|
| `memory_order_relaxed` | 只保证原子性，不保证顺序 |
| `memory_order_acquire` | 后续读写不能重排到它之前（与 release 配对） |
| `memory_order_release` | 之前的读写不能重排到它之后 |
| `memory_order_acq_rel` | 同时具备 acquire 与 release 语义 |
| `memory_order_seq_cst` | 全局顺序一致（默认） |

```c
// 典型的 release/acquire 配对：发布数据
data = 42;
atomic_store_explicit(&flag, 1, memory_order_release);

// 另一个线程
while (atomic_load_explicit(&flag, memory_order_acquire) == 0) { }
use(data);   // 此时一定能看到 data = 42
```

#### C 内存模型与数据竞争

C11 内存模型定义了：

- **sequenced-before**：同一线程内语句的先后顺序。
- **synchronizes-with**：如 release 写与 acquire 读、互斥量解锁与加锁之间的同步关系。
- **happens-before**：sequenced-before 与 synchronizes-with 的传递闭包，是判断可见性的依据。

**数据竞争（data race）**：两个线程同时访问同一内存位置，至少一个为写，且之间没有 happens-before 关系。C 标准规定数据竞争是**未定义行为**——不是「结果不确定」，而是编译器可以做任何事。消除数据竞争的三条路径：加锁、原子操作、线程局部存储（`_Thread_local`）。

#### 并发常见陷阱

- **忘记同步**：`volatile` **不能**替代 `atomic`，它只阻止编译器优化掉访问，不保证原子性与内存序。
- **死锁**：多把锁加锁顺序不一致；解决方式是固定加锁顺序，或用 `mtx_trylock` 超时。
- **忘记 `join`/`detach`**：线程资源无法回收，或主线程提前退出导致整个进程结束。
- **虚假唤醒**：条件变量等待必须放在 `while` 循环中重新检查条件。
- **伪共享（false sharing）**：不同线程频繁写同一缓存行内的不同变量，性能骤降；可用填充字节隔离。
- **信号处理**：信号处理器中只能调用 async-signal-safe 函数，且不要依赖非原子全局变量。
- **可重入**：被多线程调用的函数不应使用静态/全局可写状态，优先用局部变量或线程局部存储。

调试与验证：

```bash
gcc -fsanitize=thread -g -O1 thread_demo.c -o thread_demo   # ThreadSanitizer
valgrind --tool=helgrind ./thread_demo                       # Helgrind
```

> 建议：能用更高层抽象（任务队列 + 线程池、消息传递）时，尽量不要手写复杂的锁逻辑；临界区尽量短，锁的粒度尽量小。

### 常用标准库速查

| 头文件 | 常用内容 |
|---|---|
| `stdio.h` | `printf` `scanf` `fopen` `fgets` `fread` `fwrite` |
| `stdlib.h` | `malloc` `free` `exit` `atoi` `strtol` `qsort` `bsearch` `rand` `srand` `abs` |
| `string.h` | `strlen` `strcpy` `strcmp` `strchr` `strstr` `strtok` `memcpy` `memset` |
| `ctype.h` | `isdigit` `isalpha` `isspace` `tolower` `toupper` |
| `math.h` | `sqrt` `pow` `fabs` `sin` `cos` `floor` `ceil`（链接时加 `-lm`） |
| `time.h` | `time` `clock` `localtime` `strftime` |
| `assert.h` | `assert` 断言，`NDEBUG` 可禁用 |
| `stdint.h` | `int32_t` `uint64_t` `INT_MAX` 等定宽类型与极值 |
| `limits.h` | `INT_MAX` `CHAR_BIT` `LONG_MAX` 等 |
| `float.h` | `DBL_MAX` `DBL_EPSILON` 等 |
| `threads.h` | `thrd_create` `mtx_lock` `cnd_wait`（C11 线程） |
| `stdatomic.h` | `atomic_int` `atomic_fetch_add` `memory_order` |

### 多文件编译与头文件

```c
/* math_utils.h */
#ifndef MATH_UTILS_H
#define MATH_UTILS_H

int add(int a, int b);          // 声明
extern int global_counter;      // 外部变量声明

#endif
```

```c
/* math_utils.c */
#include "math_utils.h"

int global_counter = 0;         // 定义

int add(int a, int b) { return a + b; }
```

```c
/* main.c */
#include "math_utils.h"

int main(void) { return add(1, 2); }
```

```bash
gcc main.c math_utils.c -o app
```

约定：**声明放头文件，定义放 `.c`**；头文件用 include guard；内部实现用 `static` 隐藏。

Makefile 示例：

```makefile
CC = gcc
CFLAGS = -std=c11 -Wall -Wextra -O2
app: main.o math_utils.o
	$(CC) $(CFLAGS) -o $@ $^
%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@
clean:
	rm -f *.o app
```

### 未定义行为与常见陷阱

**未定义行为（UB）**指标准未规定结果的操作，编译器可以做任何事（包括看似正常运行）。常见来源：

- 数组/缓冲区越界访问。
- 解引用空指针、野指针、悬空指针。
- 有符号整数溢出（无符号溢出是回绕，有符号是 UB）。
- 移位量超过类型位宽，或对负数左移。
- 未初始化变量被读取。
- 修改字符串字面量（`char *s = "x"; s[0] = 'y';`）。
- 同一表达式中对同一对象多次修改且无序列点（如 `i = i++ + 1`）。
- `free` 非 `malloc` 返回的指针，或重复 `free`。

其他常见陷阱：

- `=` 与 `==` 混淆。
- `switch` 漏写 `break` 导致贯穿。
- `scanf` 忘记取地址 `&`；`%s` 不限制长度导致溢出（用 `%31s` 配合宽度）。
- 数组作为参数退化为指针，函数内 `sizeof` 不准。
- 返回局部数组/变量地址。
- 宏参数未加括号导致的优先级错误。
- 浮点数用 `==` 比较（应使用误差范围）。
- `printf` 的格式符与实际类型不匹配。
- 头文件重复包含导致重定义（用 include guard）。

### C 标准演进

| 标准 | 年份 | 主要新增 |
|---|---|---|
| C89/C90 | 1989/1990 | 首个 ANSI/ISO 标准 |
| C99 | 1999 | `//` 注释、变长数组、`long long`、`inline`、`stdint.h`、复合字面量 |
| C11 | 2011 | 多线程（`threads.h`）、`_Generic`、匿名结构体/联合体、`_Static_assert` |
| C17 | 2018 | 主要是缺陷修复，无重大新特性 |
| C23 | 2024 | `nullptr`、`typeof`、`constexpr`、属性 `[[...]]`、`bool` 成为关键字等 |

实战中一般以 C11 或 C17 为目标标准，并保持代码对旧编译器友好。

---

## 小结

掌握 C 的路径可以概括为：**语法（类型/运算符/控制流）→ 抽象（函数/结构体）→ 核心（指针与内存）**。其中指针与内存管理是 C 的灵魂，也是最容易出错的地方。多写、多调试，配合 `-Wall -Wextra`、AddressSanitizer 和 `valgrind` 等工具，可以更快地建立对内存模型的直觉。

推荐进一步阅读：

- 《C Programming Language》（K&R）
- 《C Primer Plus》
- 《Effective C》（Robert C. Seacord）
- 《Expert C Programming: Deep C Secrets》
