---
title: Java
description: Java 学习笔记：基础语法（类与对象、基本类型、运算符、控制流、数组、字符串、继承与多态、接口、异常、集合、I/O）与进阶语法（泛型、Lambda 与 Stream、Optional、反射与注解、并发编程、JVM 与内存模型、垃圾回收、新版本特性与工程实践）。
pubDate: 2026-10-1
updatedDate: 2026-10-2
tags:
  - 编程语言
---
Java 是一种面向对象、静态类型、跨平台的高级编程语言，由 Sun Microsystems（现 Oracle）于 1995 年发布。它通过 **JVM（Java 虚拟机）** 实现「一次编写，到处运行」，广泛用于企业级后端、Android、大数据与分布式系统。Java 强类型、生态成熟、工具链完善，是工业界最主流的语言之一。

本文按「基础语法 → 进阶语法」组织，既可作为入门提纲，也可作为日常速查。

## Java 基础语法

### 第一个程序

```java
// Hello.java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

```bash
javac Hello.java     # 编译为 Hello.class 字节码
java Hello           # 由 JVM 运行
```

- `public` 类名必须与文件名一致（`Hello` ↔ `Hello.java`）。
- `main` 是入口，签名固定为 `public static void main(String[] args)`。
- Java 是**静态类型**语言：每个变量都必须先声明类型。

### 基本数据类型与包装类

| 类型 | 大小 | 默认值 | 包装类 |
|---|---|---|---|
| `byte` | 1 字节 | 0 | `Byte` |
| `short` | 2 字节 | 0 | `Short` |
| `int` | 4 字节 | 0 | `Integer` |
| `long` | 8 字节 | 0L | `Long` |
| `float` | 4 字节 | 0.0f | `Float` |
| `double` | 8 字节 | 0.0d | `Double` |
| `char` | 2 字节 | `'\u0000'` | `Character` |
| `boolean` | JVM 相关 | false | `Boolean` |

自动装箱与拆箱：

```java
Integer boxed = 42;      // 自动装箱
int unboxed = boxed;     // 自动拆箱
// 注意：Integer 缓存 -128..127，超出范围时 == 比较可能为 false
```

`String` 是引用类型（不可变），不属于基本类型。局部变量必须显式初始化，而成员变量有默认值。

### 变量与常量

```java
int count = 0;
final double PI = 3.14159;              // 常量，不可重新赋值
var list = new ArrayList<String>();     // Java 10+ 局部变量类型推断
```

`var` 只能用于局部变量，且必须在声明时初始化，编译后类型即确定。

### 运算符

与 C 基本一致：算术 `+` `-` `*` `/` `%`，关系 `==` `!=` `<` `<=` `>` `>=`，逻辑 `&&`、`||`、`!`，位运算，赋值，三目 `?:`，以及 `instanceof`。

- 整数除法会截断；`%` 结果的符号与被除数一致。
- `&&` / `||` 短路；`&` / `|` 用于布尔时不短路。
- `==` 对基本类型比较值，对引用类型比较**引用是否相同**；字符串比较内容要用 `equals`。

### 控制流

```java
if (score >= 90) {
    ...
} else if (score >= 60) {
    ...
} else {
    ...
}

switch (day) {
    case 1, 2, 3 -> System.out.println("weekday");   // 箭头语法，无贯穿
    default -> System.out.println("other");
}

for (int i = 0; i < 10; i++) { ... }
for (int x : array) { ... }          // 增强 for
while (cond) { ... }
do { ... } while (cond);
```

Java 14+ 的 `switch` 表达式：

```java
String type = switch (code) {
    case 1 -> "one";
    case 2 -> "two";
    default -> "other";
};
```

### 数组

```java
int[] a = {1, 2, 3};
int[] b = new int[5];        // 默认全 0
int[][] m = {{1, 2}, {3, 4}};

System.out.println(a.length);
int[] copy = Arrays.copyOf(a, a.length);
Arrays.sort(a);
```

数组长度固定，越界会抛 `ArrayIndexOutOfBoundsException`。需要可变长度请使用集合。

### 字符串

```java
String s = "hello";
s.length();
s.charAt(0);
s.substring(1, 3);
s.toUpperCase();
s.equals("hello");            // 比较内容
s.equalsIgnoreCase("HELLO");
s.contains("ell");
"a,b,c".split(",");
String.join("-", "a", "b");

// 大量拼接用 StringBuilder
StringBuilder sb = new StringBuilder();
sb.append("a").append(1);
String result = sb.toString();
```

`String` 不可变，字面量存放在**字符串常量池**，编译期可优化常量拼接。循环内拼接字符串务必用 `StringBuilder`，否则会产生大量临时对象。

### 类与对象

```java
public class Person {
    private String name;        // 封装：私有字段
    private int age;

    public Person(String name, int age) {   // 构造器
        this.name = name;
        this.age = age;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    @Override
    public String toString() {
        return "Person{" + name + ", " + age + "}";
    }
}
```

访问修饰符（可见性由宽到窄）：`public` > `protected` > 包内默认 > `private`。`this` 指当前对象，`static` 成员属于类而非实例。

### 面向对象：继承、多态、接口

```java
public abstract class Animal {          // 抽象类
    protected String name;

    public Animal(String name) { this.name = name; }

    public abstract void speak();       // 抽象方法，子类必须实现

    public void eat() { System.out.println(name + " eats"); }
}

public class Dog extends Animal {
    public Dog(String name) { super(name); }

    @Override
    public void speak() { System.out.println("Woof"); }
}

public interface Swimmable {
    void swim();                        // 接口方法默认 public abstract
    default void floatOnWater() { }     // 默认方法（Java 8+）
    static Swimmable of() { return null; }
}

Animal a = new Dog("Rex");   // 向上转型
a.speak();                   // 运行时多态：调用 Dog 的实现
```

- **重写（override）**：子类重新实现父类方法，签名相同；**重载（overload）**：同类中方法名相同、参数列表不同。
- 子类构造器会隐式调用 `super()`，除非显式调用。
- Java 类单继承，接口可多实现。

### 枚举

```java
public enum Status {
    NEW("新建"), RUNNING("运行中"), DONE("完成");

    private final String label;
    Status(String label) { this.label = label; }
    public String getLabel() { return label; }
}
```

枚举是类型安全的常量集合，可带字段、方法和构造器，推荐替代 `int` 常量。

### 异常

```java
public class Main {
    public static void main(String[] args) {
        try {
            int r = divide(1, 0);
        } catch (ArithmeticException e) {
            System.out.println("除零: " + e.getMessage());
        } finally {
            System.out.println("always");
        }
    }

    static int divide(int a, int b) {
        if (b == 0) throw new IllegalArgumentException("b 不能为 0");
        return a / b;
    }
}
```

- `Exception` 及其子类（除 `RuntimeException`）是**受检异常**，必须捕获或声明 `throws`；`Error` 与 `RuntimeException` 是**非受检**。
- try-with-resources 自动关闭资源：

```java
try (var in = new FileInputStream("a.txt")) {
    ...
} catch (IOException e) {
    e.printStackTrace();
}
```

### 集合框架

```java
List<String> list = new ArrayList<>();
list.add("a");
list.get(0);

Map<String, Integer> map = new HashMap<>();
map.put("a", 1);
map.get("a");
map.getOrDefault("x", 0);
for (Map.Entry<String, Integer> e : map.entrySet()) { ... }

Set<String> set = new HashSet<>();
set.add("a");
```

常见实现：`List` → `ArrayList`（随机访问快）/ `LinkedList`；`Set` → `HashSet` / `TreeSet`；`Map` → `HashMap` / `TreeMap` / `LinkedHashMap`。遍历时删除元素要使用 `Iterator` 的 `remove`。

### 输入输出

```java
import java.util.Scanner;

Scanner sc = new Scanner(System.in);
int n = sc.nextInt();
String line = sc.nextLine();
```

`System.out.println` / `System.out.printf` 用于输出；文件操作推荐 `java.nio.file.Files`。

## Java 进阶语法

### 泛型

```java
public class Box<T> {
    private T value;
    public void set(T value) { this.value = value; }
    public T get() { return value; }
}

public static <E> void printAll(List<E> list) { ... }

// 通配符
List<? extends Number> nums;   // 上界：主要可读
List<? super Integer> sink;    // 下界：主要可写
```

**类型擦除**：泛型信息在编译后被擦除（上界或 `Object`），因此不能 `new T[]`、不能对泛型做 `instanceof`、不能仅靠泛型参数不同来重载方法。

### Lambda 与函数式接口

```java
@FunctionalInterface
interface Calculator {
    int calc(int a, int b);
}

Calculator add = (a, b) -> a + b;
Calculator mul = Integer::multiply;   // 方法引用

List<String> names = List.of("Tom", "Amy");
names.forEach(System.out::println);

names.sort((a, b) -> a.compareTo(b));
```

内置函数式接口：`Function`、`Consumer`、`Supplier`、`Predicate`、`BiFunction`、`UnaryOperator` 等，位于 `java.util.function`。

### Stream API

```java
List<String> result = names.stream()
    .filter(n -> n.length() > 2)
    .map(String::toUpperCase)
    .sorted()
    .distinct()
    .collect(Collectors.toList());

int total = numbers.stream().mapToInt(Integer::intValue).sum();

Map<Boolean, List<Integer>> parts = numbers.stream()
    .collect(Collectors.partitioningBy(n -> n % 2 == 0));
```

要点：Stream 是**惰性**的，只有终端操作（`collect` / `forEach` / `reduce` / `count`）才触发计算；它不修改原集合；并行流用 `parallelStream()`，但要注意线程安全与开销。

### Optional

```java
Optional<String> opt = Optional.ofNullable(getName());
String name = opt.orElse("default");
opt.ifPresent(System.out::println);
String upper = opt.map(String::toUpperCase).orElse("");
```

`Optional` 用于显式表达「可能为空」，减少 `NullPointerException`；但不应滥用为字段类型或方法参数。

### 反射与注解

```java
Class<?> clazz = Class.forName("com.example.Person");
Object obj = clazz.getDeclaredConstructor().newInstance();
Method m = clazz.getDeclaredMethod("getName");
m.setAccessible(true);
Object r = m.invoke(obj);
```

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Logged { }

@Logged
public void doWork() { }
```

注解本身不做事，需要处理器（编译期或运行期反射）读取；Spring、JUnit 等框架大量依赖二者。

### 并发编程

```java
// 线程
Thread t = new Thread(() -> System.out.println("run"));
t.start();
t.join();

// 线程池
ExecutorService pool = Executors.newFixedThreadPool(4);
Future<Integer> future = pool.submit(() -> 1 + 1);
System.out.println(future.get());
pool.shutdown();

// CompletableFuture 组合异步任务
CompletableFuture.supplyAsync(() -> "a")
    .thenApply(String::toUpperCase)
    .thenAccept(System.out::println);
```

同步与可见性：

- `synchronized`：互斥 + 内存可见性，可修饰方法或代码块。
- `volatile`：保证可见性与有序性，**不保证原子性**。
- `java.util.concurrent`：`ReentrantLock`、`CountDownLatch`、`Semaphore`、`ConcurrentHashMap`、原子类 `AtomicInteger`。

```java
synchronized (lock) {
    count++;
}
```

**Java 内存模型（JMM）** 通过 `happens-before` 规则定义线程间可见性，是理解并发正确性的基础。

### JVM 与垃圾回收

- **JVM 内存结构**：堆（对象）、虚拟机栈（栈帧 / 局部变量）、本地方法栈、程序计数器、方法区 / 元空间（类元数据）。
- **GC**：基于可达性分析（GC Roots）判断对象存活。常见收集器：Serial、Parallel、CMS（已废弃）、G1（默认）、ZGC、Shenandoah。
- 对象优先在**新生代 Eden** 分配，经历多次 Minor GC 后晋升老年代。
- 排查工具：`jps`、`jstat`、`jmap`、`jstack`、VisualVM、JFR。

```bash
java -Xms512m -Xmx2g -XX:+UseG1GC -jar app.jar
```

### 类加载机制

双亲委派模型：Bootstrap → Platform（原 Extension）→ Application → 自定义类加载器。类的生命周期：加载 → 验证 → 准备 → 解析 → 初始化，静态代码块与静态变量赋值在初始化阶段执行。

### equals / hashCode / toString

重写 `equals` 必须同时重写 `hashCode`，否则对象放入 `HashMap` / `HashSet` 时行为异常：

```java
@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Person p)) return false;   // Java 16+ 模式匹配
    return age == p.age && Objects.equals(name, p.name);
}

@Override
public int hashCode() {
    return Objects.hash(name, age);
}
```

### 新版本特性

| 版本 | 主要特性 |
|---|---|
| Java 8 | Lambda、Stream、Optional、接口默认方法、新日期时间 API |
| Java 9 | 模块系统 JPMS、集合工厂方法、改进的 JShell |
| Java 10 | `var` 局部变量类型推断 |
| Java 11 | `HttpClient`、`String` 新方法、单文件运行 |
| Java 14–17 | `record`、`sealed`、模式匹配 `instanceof`、`switch` 表达式、文本块 |
| Java 21 | 虚拟线程（Virtual Threads）、`record` 模式、分代 ZGC |

```java
// record：不可变数据载体，自动生成构造器、访问器、equals、hashCode、toString
public record Point(int x, int y) { }

// 文本块
String json = """
    { "name": "Tom" }
    """;
```

### 构建与生态

- 构建工具：**Maven**（`pom.xml`）、**Gradle**（`build.gradle`）。
- 测试：**JUnit 5**、AssertJ、Mockito。
- 常用库：Spring / Spring Boot（Web）、MyBatis / JPA（持久化）、Jackson（JSON）、SLF4J + Logback（日志）、Guava。

```xml
<!-- Maven 依赖示例 -->
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.10.0</version>
    <scope>test</scope>
</dependency>
```

### 最佳实践

- 面向接口编程，优先组合而非继承。
- 优先使用 `final` 与不可变对象，减少共享可变状态。
- 用 try-with-resources 管理资源；不要吞异常或只打印堆栈。
- 集合指定初始容量；作为 `HashMap` 键的类型应不可变。
- 避免在循环内拼接字符串，避免过早优化；用 JProfiler / JFR 定位瓶颈。
- 并发优先使用 `java.util.concurrent` 的高阶工具，而非裸 `Thread`。

---

## 小结

Java 的骨架是**面向对象 + JVM**，能力则体现在泛型、Lambda/Stream、并发包与生态框架上。打好语法与 OOP 基础后，重点转向集合与并发原理、JVM 内存与 GC，以及用 Spring 等框架构建工程。

推荐阅读：《Effective Java》《Java 核心技术》《深入理解 Java 虚拟机》。
