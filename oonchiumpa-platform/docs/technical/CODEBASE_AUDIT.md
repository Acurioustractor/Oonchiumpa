# Oonchiumpa Codebase Audit & Cleanup Strategy

## 🎯 **Current State Analysis**

### **Files to KEEP (Strategic Value)**
```
✅ oonchiumpa-platform/              # New monorepo - MAIN PROJECT
   ├── README.md                     # Main project documentation
   ├── package.json                  # Monorepo configuration
   ├── turbo.json                    # Build orchestration
   ├── .gitignore                    # Version control rules
   ├── data/schemas/                 # Data validation schemas
   └── packages/cultural-protocols/  # Cultural validation system

✅ Docs/                             # Source documentation
   ├── NIAA Strat.md                # NIAA strategy (funding)
   ├── Oonch_report.md              # Evaluation report (data source)
   └── Strategy.md                  # Strategic planning

✅ PROJECT_ARCHITECTURE.md           # Technical architecture doc
✅ .taskmaster/                      # Development task tracking
```

### **Files to MIGRATE (Legacy with Value)**
```
🔄 images/nt-map.svg                # → oonchiumpa-platform/data/media/images/
🔄 Current HTML/CSS/JS files        # → Reference for design migration
   ├── index.html                   # → Design patterns for React
   ├── styles.css                   # → Extract colors/layouts for Tailwind
   ├── strategy.html                # → Content structure for Strategy page
   ├── stories.html                 # → Content structure for Stories page
   ├── impact.html                  # → Content structure for Impact dashboard
   └── animations.js/strategy.js    # → Animation patterns for React components
```

### **Files to REMOVE (Obsolete/Redundant)**
```
❌ oonchiumpa-react/                # Simple React app - superseded by monorepo
❌ server.js                        # Basic server - replaced by api-gateway
❌ package.json (root)              # Conflicts with monorepo structure
❌ README.md (root)                 # Replaced by platform README
```

## 🧹 **Cleanup Strategy**

### **Phase 1: Consolidate Architecture**
1. **Single Source of Truth**: `oonchiumpa-platform/` becomes the only active codebase
2. **Legacy Preservation**: Archive old files in `legacy/` folder for reference
3. **Documentation Migration**: Move all docs under platform structure
4. **Asset Migration**: Move images/media to proper data structure

### **Phase 2: Strategic File Organization**
```
oonchiumpa-platform/               # MAIN PROJECT ROOT
├── README.md                      # Primary documentation
├── CONTRIBUTING.md                # Development guidelines
├── CHANGELOG.md                   # Version history
├── package.json                   # Monorepo configuration
├── turbo.json                     # Build orchestration
├── .gitignore                     # Version control
├── .env.example                   # Environment template
├── docker-compose.yml             # Local development
├──
├── apps/                          # Applications
│   ├── web-frontend/              # Main website (React)
│   ├── cms-admin/                 # Content management
│   ├── api-gateway/               # Backend services
│   └── data-lake/                 # Data processing
├──
├── packages/                      # Shared libraries
│   ├── ui-components/             # Design system
│   ├── data-models/               # TypeScript schemas
│   ├── cultural-protocols/        # Aboriginal validation
│   └── api-client/                # Shared API
├──
├── data/                          # Data management
│   ├── raw/                       # Source documents
│   ├── processed/                 # Structured data
│   ├── media/                     # Assets (images, videos)
│   ├── schemas/                   # Validation schemas
│   └── migrations/                # Database updates
├──
├── docs/                          # Documentation
│   ├── README.md                  # Documentation index
│   ├── technical/                 # Developer docs
│   ├── cultural/                  # Cultural guidelines
│   ├── user-guides/               # End-user help
│   └── legacy/                    # Historical reference
├──
├── infrastructure/                # DevOps
│   ├── docker/                    # Container configs
│   ├── kubernetes/                # Deployment
│   └── scripts/                   # Automation
├──
├── tests/                         # Testing
│   ├── e2e/                       # End-to-end
│   ├── integration/               # Integration
│   └── performance/               # Performance
├──
├── tools/                         # Development tools
│   ├── build/                     # Build tools
│   ├── generators/                # Code generation
│   └── validation/                # Cultural validation
└──
└── legacy/                        # Archived reference
    ├── original-html/             # Original prototype
    ├── design-reference/          # Design patterns
    └── migration-notes/           # Transition docs
```

### **Phase 3: Clean Development Strategy**

#### **File Naming Conventions**
```
📁 Folders:     kebab-case         (user-management, api-client)
📄 Components:  PascalCase.tsx     (UserProfile.tsx, ImpactDashboard.tsx)
📄 Utilities:   camelCase.ts       (formatMetrics.ts, validateContent.ts)
📄 Constants:   UPPER_CASE.ts      (API_ENDPOINTS.ts, CULTURAL_SENSITIVITY.ts)
📄 Types:       kebab-case.types.ts (impact-metrics.types.ts)
📄 Tests:       *.test.ts/.tsx     (UserProfile.test.tsx)
📄 Stories:     *.stories.tsx      (Button.stories.tsx)
```

#### **Import/Export Strategy**
```typescript
// Barrel exports for clean imports
packages/ui-components/src/index.ts
packages/data-models/src/index.ts
packages/cultural-protocols/src/index.ts

// Usage in apps
import { Button, Card } from '@oonchiumpa/ui-components'
import { ImpactMetric } from '@oonchiumpa/data-models'
import { validateCulturalContent } from '@oonchiumpa/cultural-protocols'
```

## 📋 **Implementation Plan**

### **Step 1: Archive Legacy**
```bash
# Create legacy archive
mkdir -p oonchiumpa-platform/legacy/original-prototype
mkdir -p oonchiumpa-platform/legacy/design-reference

# Move legacy files
mv index.html stories.html impact.html strategy.html oonchiumpa-platform/legacy/original-prototype/
mv styles.css animations.js script.js strategy.js oonchiumpa-platform/legacy/original-prototype/
mv server.js oonchiumpa-platform/legacy/original-prototype/

# Archive simple React app
mv oonchiumpa-react oonchiumpa-platform/legacy/simple-react-prototype
```

### **Step 2: Migrate Assets**
```bash
# Move documentation
mv Docs/ oonchiumpa-platform/docs/source-documents/
mv PROJECT_ARCHITECTURE.md oonchiumpa-platform/docs/technical/

# Move media assets  
mv images/ oonchiumpa-platform/data/media/
```

### **Step 3: Complete Structure**
```bash
# Create missing directories
mkdir -p oonchiumpa-platform/{apps,infrastructure,tests,tools}
mkdir -p oonchiumpa-platform/docs/{technical,cultural,user-guides}

# Create essential files
touch oonchiumpa-platform/CONTRIBUTING.md
touch oonchiumpa-platform/CHANGELOG.md
touch oonchiumpa-platform/.env.example
```

## 🎯 **Strategic Benefits**

### **Clean Codebase**
- **Single source of truth**: One active project
- **Clear file purposes**: Every file has documented purpose
- **Consistent naming**: Follows established conventions
- **Logical grouping**: Related files are co-located

### **Development Efficiency**
- **Fast builds**: Turbo monorepo optimization
- **Type safety**: TypeScript throughout
- **Code reuse**: Shared packages prevent duplication
- **Cultural safety**: Built-in validation prevents issues

### **Maintenance Benefits**  
- **Easy navigation**: Clear folder hierarchy
- **Documentation**: Comprehensive docs structure
- **Legacy preservation**: Nothing lost, everything archived
- **Future-proof**: Scalable architecture

### **Cultural Integrity**
- **Protocol compliance**: Cultural validation at every level
- **Content protection**: Sacred content safeguards
- **Community respect**: Elder approval workflows
- **Knowledge preservation**: Traditional knowledge protection

## 🚀 **Next Steps**

1. **Execute cleanup** following the implementation plan
2. **Initialize applications** within clean structure
3. **Migrate design patterns** from legacy HTML/CSS
4. **Implement cultural protocols** from day one
5. **Set up development workflows** with proper tooling

This cleanup creates a foundation for:
- **Professional development** practices
- **Scalable architecture** for growth
- **Cultural respect** in technology
- **Funding readiness** for grants
- **Community empowerment** through technology