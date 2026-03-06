¡Perfecto! 😄 He integrado tu sección de **UI y constantes** al README, dejando claro cómo tus `COLOR_MAP`, `ROMCAL_MAP` y `SEASON_INFO` se conectan con el dataset y los tipos de TS. Aquí tienes la versión **final consolidada con UI Integration y flujo de lectura litúrgica**:

---

# 📘 Leccionario Romano – Dataset JSON

Este repositorio contiene un **dataset en JSON** con las lecturas del **Leccionario Romano**. Está diseñado para aplicaciones que necesiten obtener lecturas litúrgicas por:

* fecha
* tiempo litúrgico
* tipo de celebración
* ciclo litúrgico

Se puede usar en **React, Node.js o APIs litúrgicas**.

---

# 📁 Estructura de carpetas

```text
.
├── celebrations
│   ├── 1_solemnity.json
│   ├── 2_saint.json
│   └── 3_movable_celebrations.json
├── sunday
│   ├── 1_advent.json
│   ├── 2_christmas.json
│   ├── 3_lent.json
│   ├── 4_triduum.json
│   └── 5_ot.json
└── weekdays
    ├── 1_advent.json
    ├── 2_christmas.json
    ├── 3_lent.json
    ├── 4_easter.json
    └── 5_ot.json
```

---

# 🎯 Carpeta `celebrations`

Contiene celebraciones **independientes del ciclo semanal**.

| Archivo                       | Contenido                                  |
| ----------------------------- | ------------------------------------------ |
| `1_solemnity.json`            | Solemnidades con lecturas propias          |
| `2_saint.json`                | Fiestas o memorias de santos               |
| `3_movable_celebrations.json` | Celebraciones móviles (ej. Corpus Christi) |

**Ejemplo:**

```json
{
  "firstReading": "Isa 62:1-5",
  "psalm": "Ps 89:4-5,16-17,27+29",
  "secondReading": "Acts 13:16-17,22-25",
  "gospel": ["Matt 1:1-25", "Matt 1:18-25"],
  "yearCycle": "",
  "yearNumber": "",
  "season": "christmas",
  "massType": ["solemnity", "vigil"],
  "weekdayType": "sunday",
  "weekOrder": "",
  "periodOfDay": "day",
  "slug": "nativityOfTheLord",
  "description": "Solemnity of the Nativity of Our Lord or Christmas"
}
```

---

# 🎯 Carpeta `sunday`

Lecturas de **domingos**, organizadas por tiempo litúrgico:

| Archivo            | Tiempo litúrgico |
| ------------------ | ---------------- |
| `1_advent.json`    | Adviento         |
| `2_christmas.json` | Navidad          |
| `3_lent.json`      | Cuaresma         |
| `4_triduum.json`   | Triduo pascual   |
| `5_ot.json`        | Tiempo ordinario |

* Ciclo dominical: **A-B-C**
* `yearNumber` siempre es `""` (vacío) en domingos.

---

# 🎯 Carpeta `weekdays`

Lecturas de **ferias (días entre semana)**:

| Archivo            | Tiempo litúrgico |
| ------------------ | ---------------- |
| `1_advent.json`    | Adviento         |
| `2_christmas.json` | Navidad          |
| `3_lent.json`      | Cuaresma         |
| `4_easter.json`    | Pascua           |
| `5_ot.json`        | Tiempo ordinario |

* Ciclo ferial: **1-2** (string)

  * `"1"` = año impar
  * `"2"` = año par

---

# 🔤 Notación y convenciones

### Ciclos y tiempos litúrgicos (en inglés)

| Campo        | Valor     | Significado                                |
| ------------ | --------- | ------------------------------------------ |
| `yearCycle`  | A         | Ciclo dominical A (Evangelio según Mateo)  |
| `yearCycle`  | B         | Ciclo dominical B (Evangelio según Marcos) |
| `yearCycle`  | C         | Ciclo dominical C (Evangelio según Lucas)  |
| `yearNumber` | 1         | Ciclo ferial 1 (años impares)              |
| `yearNumber` | 2         | Ciclo ferial 2 (años pares)                |
| `season`     | advent    | Adviento                                   |
| `season`     | christmas | Navidad                                    |
| `season`     | lent      | Cuaresma                                   |
| `season`     | easter    | Pascua                                     |
| `season`     | triduum   | Triduo pascual                             |
| `season`     | ot        | Tiempo Ordinario                           |

---

### Letras en los salmos (`a`, `b`, `c`, `d`)

* Indican **qué fracción del versículo leer** (semiversículos).

**Ejemplo:** `Ps 97:1+2b,6+7c,9`

* v.1 completo
* v.2 segunda parte (`b`)
* v.6 completo
* v.7 tercera parte (`c`)
* v.9 completo

**Nota:** Puede contener referencias a libros que **no son Salmos** (ej. Dan 3, Isa 12) cuando se usa un cántico bíblico.

---

### Acrónimos de los libros de la Biblia

*(Tabla completa: Gen, Exod, Isa, Matt, etc.)*

---

# 🌳 Mapa visual del dataset

```text
leccionario/
├── celebrations/                 
│   ├── 1_solemnity.json         
│   ├── 2_saint.json             
│   └── 3_movable_celebrations.json
│
├── sunday/                       
│   ├── 1_advent.json             
│   │   └─ yearNumber: ""         
│   └── ...
│
└── weekdays/                     
    ├── 1_advent.json
    └── 5_ot.json
        └─ yearNumber: string     
```

---

# ⚙️ Uso en React / TypeScript

```ts
interface Reading {
  firstReading: string;
  psalm: string;
  secondReading: string;
  gospel: string | string[];
  yearCycle: string;      // "A", "B", "C" o ""
  yearNumber: string;     // "" | "1" | "2"
  season: string;
  massType: string | string[];
  weekdayType: string;
  weekOrder: string;
  periodOfDay: string;
  slug: string;
  description: string;
}
```

```ts
import sundayAdvent from "../data/sunday/1_advent.json";
const reading: Reading = sundayAdvent["2026-03-06"];
```

---

# 🎨 UI Integration con constantes

Integrar tus constantes con el dataset es el paso final para que la aplicación sea coherente **visual y litúrgicamente**.

Tus mapas (`SEASON_INFO`, `COLOR_MAP`, `ROMCAL_MAP`) actúan como **puente estético**, traduciendo los datos crudos del JSON a una interfaz rica.

---

### 🗺️ Algoritmo de Selección de Lecturas y Estilo

#### 1️⃣ Prioridad de Selección ("Waterfall Logic")

1. **Solemnidad o Fiesta** → `celebrations/1_solemnity.json` o `3_movable_celebrations.json` usando `slug`
2. **Domingo** → `sunday/{season}.json` usando `yearCycle` y `weekOrder`
3. **Memoria de Santo** → `celebrations/2_saint.json` por fecha
4. **Fallback (Feria)** → `weekdays/{season}.json` usando `yearNumber` ("1" o "2")

#### 2️⃣ Mapeo de Tiempos (`ROMCAL_MAP` + `SEASON_INFO`)

* Romcal `ADVENT` → `1_advent.json`
* Romcal `CHRISTMASTIDE` → `2_christmas.json`

#### 3️⃣ Aplicación de Estilo (`COLOR_MAP`)

* `season: "lent"` o `"advent"` → `COLOR_MAP.PURPLE`
* `massType: "solemnity"` → `COLOR_MAP.WHITE` o `GOLD`
* `season: "ot"` → `COLOR_MAP.GREEN`

---



