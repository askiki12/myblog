---
title: CPP
description: C++ 学习笔记：基础语法（数据类型、引用、函数重载、命名空间、类与对象、运算符重载、继承与多态、模板入门、STL、异常、I/O）与进阶语法（模板进阶、智能指针与 RAII、移动语义、Lambda、STL 深入、并发、编译期计算、现代 C++ 新特性与构建）。
pubDate: 2026-10-1
updatedDate: 2026-10-2
tags:
  - 编程语言
---
C++ 由 Bjarne Stroustrup 于 1983 年在 C 的基础上发展而来，是一门**多范式**语言：既支持面向过程，也支持面向对象、泛型与函数式编程。它保留了 C 的性能与底层控制能力，又提供了类、模板、RAII、STL 等高级抽象，广泛用于游戏引擎、高性能服务、编译器与系统软件。

本文按「基础语法 → 进阶语法」组织，既可作为入门提纲，也可作为日常速查。

## C++ 基础语法

### 第一个程序

```cpp
#include <iostream>

int main()
{
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
```

```bash
g++ -std=c++17 -Wall -Wextra hello.cpp -o hello
./hello
```

- `<iostream>` 提供输入输出流，`std::cout` / `std::cin` 分别是标准输出与输入。
- `std::endl` 换行并刷新缓冲；只换行用 `'\n'`，通常更快。
- 建议始终使用 `std::` 前缀或局部 `using`，避免污染全局命名空间。

### 数据类型与变量

基本类型与 C 类似：`bool`、`char`、`short`、`int`、`long`、`long long`、`float`、`double`、`long double`。此外：

```cpp
auto n = 42;              // 类型推断（C++11）
decltype(n) m = n;        // 取表达式的类型
constexpr int k = 10;     // 编译期常量（C++11）
int a = 0b1010;           // 二进制字面量（C++14）
long big = 1'000'000;     // 数字分隔符（C++14）
```

**引用**是 C++ 的重要特性：

```cpp
int x = 1;
int &ref = x;       // 引用：x 的别名，必须初始化且不可重新绑定
ref = 2;            // 等价于 x = 2

const int &cr = x;  // 常量引用：不能通过它修改所指对象
int &&rref = 3;     // 右值引用（C++11，用于移动语义）
```

引用 vs 指针：引用更安全、语法更自然；指针可为空、可重新指向、可做算术。

### 运算符与控制流

运算符与 C 基本一致。C++ 额外提供 `::`（作用域）、`new` / `delete`，以及四种类型转换：`static_cast`、`dynamic_cast`、`const_cast`、`reinterpret_cast`。

控制流（`if` / `switch` / `for` / `while` / `do-while`）与 C 相同，另支持基于范围的 for：

```cpp
int arr[] = {1, 2, 3};
for (int v : arr) std::cout << v << ' ';
for (const auto &v : arr) { /* 避免拷贝 */ }
```

C++17 起 `if` / `switch` 可带初始化语句：

```cpp
if (auto it = map.find(key); it != map.end()) {
    use(it->second);
}
```

### 函数

```cpp
int add(int a, int b = 0);          // 声明可带默认参数

int add(int a, int b) { return a + b; }   // 定义

double add(double a, double b);     // 重载：参数不同

inline int square(int x) { return x * x; }   // 建议内联

void swap(int &a, int &b) { int t = a; a = b; b = t; }   // 引用传参

void print(std::initializer_list<int> vals);   // 初始化列表
```

- **函数重载**：同名不同参数；返回类型不参与重载。
- **默认参数**：只能从右往左设置，声明与定义不能重复指定。
- 按 `const&` 传参避免拷贝；小类型按值传递即可。

### 命名空间

```cpp
namespace math {
    const double pi = 3.14159;
    int add(int a, int b) { return a + b; }
}

using math::pi;          // 引入单个名字
using namespace math;    // 引入整个命名空间（头文件中应避免）
```

C++17 支持嵌套定义：`namespace a::b::c { }`。

### 类与对象

```cpp
#include <string>
#include <utility>

class Person {
public:
    Person(std::string name, int age)
        : name_(std::move(name)), age_(age) {}   // 成员初始化列表
    ~Person() = default;                         // 析构函数

    const std::string &name() const { return name_; }   // const 成员函数
    void setName(const std::string &name) { name_ = name; }

    static int count() { return count_; }        // 静态成员函数

private:
    std::string name_;
    int age_;
    static int count_;                           // 静态成员变量
};

int Person::count_ = 0;                          // 类外定义
```

要点：

- 访问控制：`public` / `protected` / `private`。
- **初始化列表**按成员声明顺序初始化，比在函数体内赋值更高效，且能初始化 `const` 与引用成员。
- `const` 成员函数承诺不修改对象，可被 `const` 对象调用。
- `explicit` 禁止单参构造的隐式转换。
- `= default` / `= delete` 显式要求或禁止编译器生成特殊成员函数。

### 运算符重载

```cpp
class Vec2 {
public:
    Vec2(double x, double y) : x_(x), y_(y) {}
    Vec2 operator+(const Vec2 &o) const { return {x_ + o.x_, y_ + o.y_}; }
    bool operator==(const Vec2 &o) const { return x_ == o.x_ && y_ == o.y_; }
private:
    double x_, y_;
};

std::ostream &operator<<(std::ostream &os, const Vec2 &v);
```

不能重载 `::`、`.`、`.*`、`?:`、`sizeof`，也不能创造新运算符。`<<` / `>>` 通常重载为非成员函数（必要时声明为友元）。

### 继承与多态

```cpp
class Shape {
public:
    virtual double area() const = 0;      // 纯虚函数 → 抽象类
    virtual ~Shape() = default;           // 虚析构：多态删除必需
};

class Circle : public Shape {
public:
    explicit Circle(double r) : r_(r) {}
    double area() const override { return 3.14159 * r_ * r_; }
private:
    double r_;
};

Shape *s = new Circle(1.0);
delete s;   // 若基类析构非 virtual，则是未定义行为
```

- `virtual` 实现运行时多态；`override` 明确表示重写，可捕获签名错误。
- 基类析构函数应为 `virtual`，否则通过基类指针删除派生对象会泄漏。
- `final` 禁止进一步派生或重写。
- 优先使用**组合**而非继承；多态基类通常配合智能指针使用。

### 模板入门

```cpp
template <typename T>
T maxOf(T a, T b) { return a > b ? a : b; }

template <typename T>
class Box {
public:
    void set(const T &v) { value_ = v; }
    const T &get() const { return value_; }
private:
    T value_;
};

Box<int> b;
b.set(1);
```

模板在编译期实例化，为每种类型生成一份代码。

### STL 入门

```cpp
#include <vector>
#include <string>
#include <map>
#include <algorithm>

std::vector<int> v = {3, 1, 2};
v.push_back(4);
std::sort(v.begin(), v.end());

std::map<std::string, int> m;
m["a"] = 1;

for (const auto &[key, val] : m) {   // C++17 结构化绑定
    std::cout << key << '=' << val << '\n';
}

auto it = std::find(v.begin(), v.end(), 2);
```

STL 三要素：**容器**（vector / map / set…）、**迭代器**（连接容器与算法）、**算法**（sort / find / transform…）。

### 异常

```cpp
#include <stdexcept>

try {
    throw std::runtime_error("bad");
} catch (const std::exception &e) {
    std::cerr << e.what() << '\n';
} catch (...) {
    // 兜底
}
```

C++ 没有受检异常；用 `catch (const E &e)` 避免对象切片。析构函数中尽量不要抛异常。

### 输入输出

```cpp
int n;
std::cin >> n;
std::string name;
std::getline(std::cin, name);

std::cout << "n=" << n << '\n';

#include <fstream>
std::ofstream out("a.txt");
out << "hello\n";
std::ifstream in("a.txt");
```

流的状态：`good` / `eof` / `fail` / `bad`；流的 RAII 特性使其离开作用域时自动关闭。

## C++ 进阶语法

### 模板进阶

```cpp
#include <iostream>
#include <type_traits>

// 可变参数模板 + 折叠表达式（C++17）
template <typename... Ts>
void print(const Ts &...args) {
    ((std::cout << args << ' '), ...);
}

// 类模板偏特化
template <typename T> struct IsPointer { static constexpr bool value = false; };
template <typename T> struct IsPointer<T *> { static constexpr bool value = true; };

// SFINAE：仅当 T 是整型时该重载才有效
template <typename T>
std::enable_if_t<std::is_integral_v<T>, T> twice(T x) { return x * 2; }
```

C++20 的 **concepts** 让约束更可读：

```cpp
#include <concepts>

template <std::integral T>
T add(T a, T b) { return a + b; }
```

模板是泛型编程的基石，但会带来编译时间与错误信息膨胀，使用时需要克制。

### 智能指针与 RAII

**RAII**（Resource Acquisition Is Initialization）是 C++ 资源管理的核心：资源在构造时获取、在析构时释放。

```cpp
#include <memory>

std::unique_ptr<Foo> p = std::make_unique<Foo>();   // 独占所有权，不可拷贝
std::shared_ptr<Foo> sp = std::make_shared<Foo>();  // 共享所有权，引用计数
std::weak_ptr<Foo> wp = sp;                          // 弱引用，不增加计数

auto q = std::move(p);   // 转移所有权
```

- 优先 `make_unique` / `make_shared`，避免显式 `new` / `delete`。
- `shared_ptr` 循环引用会导致泄漏，用 `weak_ptr` 打破环。
- 不要用同一个裸指针构造多个 `shared_ptr`。

### 移动语义与右值引用

```cpp
class Buffer {
public:
    Buffer(Buffer &&other) noexcept                 // 移动构造
        : data_(other.data_), size_(other.size_) {
        other.data_ = nullptr;
        other.size_ = 0;
    }

    Buffer &operator=(Buffer &&other) noexcept {    // 移动赋值
        if (this != &other) {
            delete[] data_;
            data_ = other.data_;
            size_ = other.size_;
            other.data_ = nullptr;
            other.size_ = 0;
        }
        return *this;
    }

private:
    char *data_ = nullptr;
    std::size_t size_ = 0;
};
```

- `std::move` 只是把左值转换为右值引用，本身并不移动。
- 移动构造 / 赋值应标记 `noexcept`，否则容器可能退化为拷贝。
- **完美转发**：`template <typename T> void f(T &&x) { g(std::forward<T>(x)); }`。

### Lambda 与 std::function

```cpp
int base = 10;
auto add = [base](int x) { return base + x; };      // 按值捕获
auto byRef = [&base] { base++; };                    // 按引用捕获
auto counter = [n = 0]() mutable { return ++n; };    // 初始化捕获（C++14）

#include <functional>
std::function<int(int)> f = [](int x) { return x * 2; };
```

捕获列表 `[=]` 按值、`[&]` 按引用；异步回调中按引用捕获要警惕悬空引用。

### STL 深入

容器选择：

| 需求 | 推荐容器 |
|---|---|
| 动态数组、随机访问 | `vector` |
| 频繁头尾插入删除 | `deque` |
| 有序键值查找 | `map` / `set`（红黑树） |
| 平均 O(1) 查找 | `unordered_map` / `unordered_set` |
| 频繁中间插入删除 | `list` |

```cpp
#include <algorithm>
#include <vector>

std::vector<int> v = {3, 1, 4, 1, 5};

std::sort(v.begin(), v.end(), std::greater<int>());
std::reverse(v.begin(), v.end());
auto it = std::lower_bound(v.begin(), v.end(), 3);   // 要求区间已排序

std::transform(v.begin(), v.end(), v.begin(), [](int x) { return x * 2; });
int cnt = std::count_if(v.begin(), v.end(), [](int x) { return x > 2; });

std::vector<int> out;
std::copy_if(v.begin(), v.end(), std::back_inserter(out),
             [](int x) { return x % 2 == 1; });
```

C++20 引入 **ranges**，可链式组合算法：

```cpp
#include <ranges>

auto evens = v | std::views::filter([](int x) { return x % 2 == 0; })
               | std::views::transform([](int x) { return x * x; });
```

### 并发编程

```cpp
#include <thread>
#include <mutex>
#include <atomic>
#include <future>
#include <condition_variable>

std::mutex mtx;
int shared = 0;

void worker() {
    std::lock_guard<std::mutex> lock(mtx);   // RAII 加锁
    ++shared;
}

std::thread t1(worker), t2(worker);
t1.join();
t2.join();

std::atomic<int> counter{0};
counter.fetch_add(1, std::memory_order_relaxed);

// 异步任务
std::future<int> f = std::async(std::launch::async, [] { return 42; });
int result = f.get();

// 条件变量
std::condition_variable cv;
std::unique_lock<std::mutex> lk(mtx);
cv.wait(lk, [] { return ready; });
```

要点：用 `lock_guard` / `unique_lock` 而不是手动 `lock` / `unlock`；`atomic` 保证原子性与可见性；共享数据优先用 `mutex` 保护或采用消息传递。

### 编译期计算与 constexpr

```cpp
constexpr int factorial(int n) { return n <= 1 ? 1 : n * factorial(n - 1); }
constexpr int f5 = factorial(5);   // 编译期求值

template <int N>
struct Fib { static constexpr int value = Fib<N - 1>::value + Fib<N - 2>::value; };

// C++20 consteval：必须在编译期求值
consteval int square(int x) { return x * x; }
```

相关关键字还有 `constinit`（保证静态初始化顺序）与 `if constexpr`（编译期分支）。

### 现代 C++ 特性速览

| 版本 | 主要特性 |
|---|---|
| C++11 | `auto`、右值引用 / 移动语义、Lambda、`nullptr`、`constexpr`、智能指针、范围 for、`thread` |
| C++14 | 泛型 Lambda、返回类型推导、`make_unique`、变量模板 |
| C++17 | 结构化绑定、`if constexpr`、`optional` / `variant` / `any`、`string_view`、折叠表达式、文件系统 |
| C++20 | concepts、ranges、协程、模块、`span`、三路比较 `<=>`、`consteval` |
| C++23 | `expected`、`print`、`mdspan` 等 |

```cpp
#include <optional>
#include <variant>
#include <string_view>

std::optional<int> maybe = std::nullopt;
std::variant<int, std::string> v = "text";
std::string_view sv = "read-only view";   // 不拥有内存，注意生命周期
```

### 多文件编译与构建

```cpp
// math_utils.hpp
#pragma once
namespace math {
    int add(int a, int b);
}
```

```cpp
// math_utils.cpp
#include "math_utils.hpp"
namespace math {
    int add(int a, int b) { return a + b; }
}
```

```bash
g++ -std=c++17 -Wall -Wextra -c math_utils.cpp
g++ -std=c++17 -Wall -Wextra main.cpp math_utils.o -o app
```

大型项目用 **CMake**：

```cmake
cmake_minimum_required(VERSION 3.16)
project(app CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(app main.cpp math_utils.cpp)
target_compile_options(app PRIVATE -Wall -Wextra)
```

```bash
cmake -S . -B build
cmake --build build
```

### 常见陷阱与最佳实践

- 优先使用 `nullptr` 而非 `NULL` / `0`。
- 优先 `const`、`enum class`、`auto`、范围 for，减少隐式转换。
- 永远不要手动 `new` / `delete`，使用智能指针与容器。
- 谁持有资源，谁负责释放；能用栈对象就别用堆对象。
- 警惕对象切片（按值传递多态基类）、悬空引用与迭代器失效。
- 头文件中不要写 `using namespace std;`，命名空间使用 `std::` 或局部 `using`。
- 编译开启 `-Wall -Wextra -Wpedantic`；调试用 AddressSanitizer（`-fsanitize=address,undefined`）与 `gdb` / `lldb`。
- 性能：为 `vector` 预留容量、按 `const&` 传参、避免多余拷贝、优先用算法而非手写循环。

---

## 小结

C++ 的能力集中在三处：**面向对象与多态**、**泛型与模板**、**资源管理与 RAII**。现代 C++ 的核心习惯是——用值语义和智能指针替代裸指针，用 `const` / `constexpr` 表达意图，用 STL 算法与 ranges 替代手写循环。

推荐阅读：《C++ Primer》《Effective Modern C++》《C++ Concurrency in Action》《A Tour of C++》。
