# 🤖 Panduan Development dengan AI Assistant

> **Cara Maksimalkan Produktivitas dengan Claude, ChatGPT, atau AI Assistant Lainnya**

Dokumentasi ini berisi best practices, tips, dan workflow untuk mengerjakan project SkillConnect menggunakan AI assistant. Dibuat berdasarkan pengalaman real development project ini.

---

## 📋 Table of Contents

- [Kenapa Pakai AI?](#-kenapa-pakai-ai)
- [AI Tools yang Recommended](#-ai-tools-yang-recommended)
- [General Guidelines](#-general-guidelines)
- [Workflow Development dengan AI](#-workflow-development-dengan-ai)
- [Prompting Best Practices](#-prompting-best-practices)
- [Use Cases & Contoh](#-use-cases--contoh)
- [Common Mistakes](#-common-mistakes)
- [Tips & Tricks](#-tips--tricks)
- [Limitations & Kapan JANGAN Pakai AI](#-limitations--kapan-jangan-pakai-ai)

---

## 🎯 Kenapa Pakai AI?

### Keuntungan:
✅ **Speed up development** - Code generation 10x lebih cepat
✅ **Reduce bugs** - AI bisa catch error patterns
✅ **Learn faster** - Dapat penjelasan langsung sambil coding
✅ **Konsisten** - Follow pattern yang sama across codebase
✅ **Documentation** - Auto-generate comments dan docs
✅ **Debugging** - Identify root cause lebih cepat

### Yang HARUS Diingat:
⚠️ AI **BUKAN** pengganti thinking - tetap perlu critical thinking
⚠️ AI bisa salah - **ALWAYS review code** yang di-generate
⚠️ AI ga tau context project - kamu harus kasih context yang cukup
⚠️ Security risks - jangan share credentials atau sensitive data

---

## 🛠️ AI Tools yang Recommended

### 1. **Claude (Anthropic)** - RECOMMENDED ⭐
- **Best for:** Full feature development, complex logic, refactoring
- **Strengths:**
  - Context window besar (bisa handle file banyak)
  - Pemahaman arsitektur yang baik
  - Code generation berkualitas tinggi
  - Bisa kasih reasoning/penjelasan
- **Pricing:** Free tier cukup, Pro $20/month
- **Link:** https://claude.ai

### 2. **ChatGPT (OpenAI)**
- **Best for:** Quick questions, debugging, algorithm help
- **Strengths:**
  - Response cepat
  - Banyak training data
  - Plugins untuk berbagai use case
- **Pricing:** Free tier available, Plus $20/month
- **Link:** https://chat.openai.com

### 3. **GitHub Copilot**
- **Best for:** Autocomplete in-editor, small functions
- **Strengths:**
  - Terintegrasi di VS Code
  - Real-time suggestions
  - Context dari file yang dibuka
- **Pricing:** $10/month (gratis untuk students)
- **Link:** https://github.com/copilot

### 4. **Cursor IDE** (VS Code Fork + AI)
- **Best for:** All-in-one development dengan AI
- **Strengths:**
  - Built-in AI chat
  - Multi-file editing
  - Codebase understanding
- **Pricing:** $20/month
- **Link:** https://cursor.sh

**Recommendation untuk project ini:**
- **Primary:** Claude (untuk feature development)
- **Secondary:** Copilot (untuk coding assistance)
- **Tertiary:** ChatGPT (untuk quick questions)

---

## 📐 General Guidelines

### DO ✅

1. **Kasih Context Lengkap**
   ```
   ❌ "Bikin payment gateway"
   ✅ "Bikin payment gateway untuk modul 4 SkillConnect.
       Tech stack: Node.js, Express, Sequelize, MySQL.
       Harus support escrow system untuk marketplace.
       Follow DDD architecture pattern yang sudah ada."
   ```

2. **Share File Structure**
   ```
   ✅ "Ini struktur modul payment saat ini:
       payment/
       ├── domain/entities/Payment.js
       ├── application/use-cases/CreatePayment.js
       ├── infrastructure/repositories/
       └── presentation/controllers/

       Tolong buatkan use case untuk verify payment."
   ```

3. **Specify Requirements Jelas**
   ```
   ✅ "Kriteria:
       - Harus validasi payment status
       - Update escrow setelah payment success
       - Kirim email notification
       - Log ke admin_logs table
       - Return error yang descriptive"
   ```

4. **Review SEMUA Code yang Digenerate**
   - Baca line by line
   - Test dengan sample data
   - Check security vulnerabilities
   - Validate business logic

5. **Iterasi dan Improve**
   - Kalau hasil kurang pas, kasih feedback
   - Minta alternative approach
   - Ask "why" untuk understand reasoning

### DON'T ❌

1. **Jangan Copy-Paste Tanpa Review**
   - Bisa ada bug subtle
   - Mungkin ga sesuai dengan codebase pattern
   - Security risks

2. **Jangan Share Credentials**
   ```
   ❌ "Ini .env file gue:
       DB_PASSWORD=mypassword123
       JWT_SECRET=supersecret"
   ```

3. **Jangan Terlalu Bergantung**
   - Tetap learn fundamental concepts
   - Understand the "why" behind solutions
   - Bisa debug without AI

4. **Jangan Ambil Shortcut**
   ```
   ❌ "Bikin payment gateway, yang penting jalan dulu,
       security belakangan"
   ```

---

## 🔄 Workflow Development dengan AI

### Step-by-Step Process:

#### 1️⃣ **Planning Phase**
```
Prompt ke AI:
"Saya mau implement [feature name].

Context:
- Tech stack: Node.js, Express, Sequelize, MySQL
- Architecture: DDD (Domain-Driven Design)
- Module: [nama modul]

Requirements:
- [list requirements]

Tolong buatkan:
1. High-level architecture design
2. List entities yang diperlukan
3. List use cases
4. Database schema changes (jika ada)
5. API endpoints yang perlu dibuat

Jangan langsung kasih code, planning dulu."
```

**Output yang diharapkan:**
- Architecture diagram (text-based)
- Entities list
- Use cases breakdown
- Database changes
- API contract

#### 2️⃣ **Implementation Phase - Entities**
```
Prompt:
"Berdasarkan planning tadi, buatkan:

1. Domain Entity untuk [EntityName]
   Lokasi: src/modules/[module]/domain/entities/[EntityName].js

   Requirements:
   - Follow pattern entity yang sudah ada
   - Include business logic methods
   - Validate data di constructor

2. Kasih penjelasan untuk setiap method"
```

#### 3️⃣ **Implementation Phase - Use Cases**
```
Prompt:
"Buatkan use case [UseCaseName]:

Lokasi: src/modules/[module]/application/use-cases/[UseCaseName].js

Business logic:
1. [step 1]
2. [step 2]
3. [step 3]

Validations:
- [validation 1]
- [validation 2]

Error handling:
- Throw error dengan message yang jelas
- Handle edge cases

Dependencies:
- [repository 1]
- [service 1]
```

#### 4️⃣ **Implementation Phase - Repository**
```
Prompt:
"Buatkan Sequelize repository implementation untuk [EntityName]:

Lokasi: src/modules/[module]/infrastructure/repositories/Sequelize[EntityName]Repository.js

Methods yang perlu:
- create(data)
- findById(id)
- update(id, data)
- delete(id)
- [custom methods...]

Requirements:
- Include error handling
- Support pagination
- Include relations/associations
```

#### 5️⃣ **Implementation Phase - Controllers & Routes**
```
Prompt:
"Buatkan:

1. Controller: src/modules/[module]/presentation/controllers/[Name]Controller.js
   - Handle HTTP requests
   - Call use cases
   - Return standardized response

2. Routes: src/modules/[module]/presentation/routes/[name]Routes.js
   - RESTful routing
   - Include Swagger documentation
   - Apply middleware (auth, validation)

Pattern response yang dipakai:
{
  status: 'success' | 'error',
  message: 'string',
  data: { ... }
}
```

#### 6️⃣ **Testing & Debugging**
```
Prompt:
"Code ini error: [paste error message]

Ini file yang bermasalah:
[paste relevant code]

Context:
- [jelaskan apa yang mau dilakukan]
- [apa yang expected]
- [apa yang terjadi]

Tolong:
1. Identifikasi root cause
2. Kasih solution
3. Explain kenapa error ini terjadi
```

#### 7️⃣ **Documentation**
```
Prompt:
"Generate documentation untuk:

1. README.md untuk modul [module name]
   - Overview
   - Features
   - API endpoints
   - Usage examples

2. Inline comments untuk code kompleks
   - Jelaskan business logic
   - Jelaskan why, bukan what
```

---

## 💡 Prompting Best Practices

### 1. **Be Specific**
```
❌ Bad: "Bikin login"
✅ Good: "Bikin login endpoint dengan JWT authentication.
         Input: email & password
         Output: { token, user }
         Validasi: email format, password min 6 char
         Error handling: 401 jika credentials salah"
```

### 2. **Provide Context**
```
✅ "Ini project marketplace dengan 8 modul.
    Architecture: DDD dengan 4 layer (domain, application, infrastructure, presentation).

    Current file structure:
    [paste relevant structure]

    Saya mau implement [feature] di [modul].
    [paste requirements]"
```

### 3. **Show Examples**
```
✅ "Ini contoh use case yang sudah ada:
    [paste existing use case]

    Tolong buatkan use case serupa untuk [new feature],
    tapi dengan logic [explain differences]"
```

### 4. **Ask for Explanation**
```
✅ "Tolong explain:
    - Kenapa pakai approach ini?
    - Apa alternative approaches?
    - Trade-offs dari solution ini?
    - Potential issues yang perlu diwatch out?"
```

### 5. **Iterate**
```
First prompt: "Buatkan payment verification logic"
[Review output]
Follow-up: "Bagus, tapi tolong tambahkan:
            - Retry mechanism untuk failed payments
            - Logging untuk audit trail
            - Email notification"
```

### 6. **Request Best Practices**
```
✅ "Tolong implementasikan dengan memperhatikan:
    - Security (SQL injection, XSS prevention)
    - Performance (pagination, caching)
    - Error handling (descriptive errors)
    - Testability (dependency injection)
    - Documentation (inline comments)"
```

---

## 🎓 Use Cases & Contoh

### Use Case 1: Implement New Feature

**Scenario:** Bikin fitur review & rating

**Step 1 - Planning:**
```
You: "Saya mau implement review & rating system untuk SkillConnect.

Context:
- Users bisa review service setelah order completed
- Rating 1-5 stars
- One review per order
- Seller bisa reply to review

Tech stack: Node.js, Express, Sequelize, MySQL, DDD architecture

Tolong planning:
1. Entities apa yang diperlukan?
2. Use cases apa saja?
3. Database schema
4. API endpoints"

AI: [Akan kasih detailed planning]

You: "Good! Sekarang buatkan entity Review dulu..."
```

**Step 2 - Implementation:**
```
You: "Buatkan Review entity di:
src/modules/review/domain/entities/Review.js

Properties:
- id (UUID)
- pesanan_id
- layanan_id
- user_id
- penyedia_id
- rating (1-5)
- komentar
- balasan_penyedia
- helpful_count
- created_at
- updated_at

Business methods:
- isPositive() - rating >= 4
- canBeReplied() - penyedia belum reply
- validate() - rating must be 1-5"

AI: [Generate entity code]
```

**Step 3 - Test & Iterate:**
```
You: "Code nya bagus, tapi tolong tambahkan:
- Method untuk increment helpful_count
- Validation komentar min 10 characters
- Timestamps menggunakan Sequelize default"

AI: [Update code]
```

---

### Use Case 2: Debug Error

**Scenario:** Sequelize error saat create payment

```
You: "Error ini muncul saat create payment:

Error: SequelizeUniqueConstraintError: Validation error
    at Payment.create (PaymentRepository.js:45:12)

Code:
[paste relevant code dari PaymentRepository.js]

Database schema:
[paste table schema]

Request body:
{
  "pesanan_id": "123",
  "jumlah": 100000,
  "metode_pembayaran": "qris"
}

Expected: Payment created successfully
Actual: Unique constraint error

Tolong bantu identify issue dan fix."

AI: "Error ini terjadi karena ada unique constraint di kolom
     transaction_id, tapi code tidak generate transaction_id
     sebelum save.

     Solution:
     1. Generate transaction_id sebelum create
     2. Atau set default value di database

     [Provide fixed code]"
```

---

### Use Case 3: Refactoring

**Scenario:** Code terlalu complex, perlu refactor

```
You: "Code ini terlalu complex dan hard to maintain:

[paste messy code]

Tolong refactor dengan:
1. Extract methods untuk improve readability
2. Separate concerns (validation, business logic, DB ops)
3. Add error handling
4. Add comments untuk complex logic

Keep the same functionality tapi improve code quality."

AI: [Provide refactored code with explanation]
```

---

### Use Case 4: Learn New Concept

**Scenario:** Ga ngerti Sequelize associations

```
You: "Saya perlu implement relationship antara tables:

users (1) --> (many) layanan
users (1) --> (many) pesanan
layanan (1) --> (many) pesanan
pesanan (1) --> (1) pembayaran

Di Sequelize, gimana cara:
1. Define associations di models
2. Query dengan include relations
3. Handle cascade delete

Kasih contoh konkrit dengan code kita (DDD structure).
Explain juga kenapa pakai approach tertentu."

AI: [Detailed explanation dengan examples]
```

---

### Use Case 5: Generate Tests

**Scenario:** Perlu unit tests untuk use case

```
You: "Generate unit tests untuk CreatePayment use case:

File: src/modules/payment/application/use-cases/CreatePayment.js
[paste use case code]

Test cases yang perlu:
1. Success case - payment created successfully
2. Validation errors - missing required fields
3. Business logic errors - pesanan already paid
4. Repository errors - database connection failed

Framework: Jest
Mocking: Perlu mock paymentRepository dan orderRepository
Assertions: Lengkap dan descriptive"

AI: [Generate comprehensive test cases]
```

---

## ⚠️ Common Mistakes

### 1. **Copy-Paste Tanpa Understand**
```
❌ Problem:
   - Copy code dari AI
   - Langsung commit tanpa review
   - Ga ngerti cara kerjanya

✅ Solution:
   - Baca dan understand every line
   - Ask AI to explain if ada yang unclear
   - Test dengan different scenarios
   - Refactor jika perlu
```

### 2. **Context Tidak Cukup**
```
❌ Bad prompt:
   "Bikin auth middleware"

✅ Good prompt:
   "Bikin auth middleware untuk SkillConnect.

    Requirements:
    - Verify JWT token dari header Authorization: Bearer <token>
    - Extract user info dari token
    - Attach ke req.user
    - Return 401 jika token invalid/expired

    Existing JWT service:
    [paste JwtService code]

    Location: src/shared/middleware/authMiddleware.js"
```

### 3. **Tidak Verify Output**
```
❌ Problem:
   - AI generate code dengan bug
   - Langsung deploy tanpa test
   - Production error

✅ Solution:
   - Always test locally
   - Check edge cases
   - Review security implications
   - Run linter & formatter
```

### 4. **Over-reliance**
```
❌ Problem:
   - Semua masalah tanya AI
   - Ga belajar fundamental
   - Ga bisa debug tanpa AI

✅ Solution:
   - Learn core concepts
   - Try to solve sendiri dulu
   - Use AI as assistant, not replacer
   - Understand the reasoning
```

### 5. **Inconsistent Pattern**
```
❌ Problem:
   - Setiap developer pakai AI dengan style berbeda
   - Codebase jadi inconsistent
   - Hard to maintain

✅ Solution:
   - Agree on patterns as team
   - Share successful prompts
   - Review each other's AI-generated code
   - Update this guide dengan learnings
```

---

## 🎯 Tips & Tricks

### 1. **Template Prompts**

Simpan template prompts yang sering dipakai:

```markdown
## Template: Create New Use Case

Context:
- Module: [module name]
- Tech: Node.js, Express, Sequelize, MySQL, DDD
- Location: src/modules/[module]/application/use-cases/

Use Case: [UseCaseName]

Input: [parameters]
Output: [return value]

Business Logic:
1. [step 1]
2. [step 2]
3. [step 3]

Validations:
- [validation 1]
- [validation 2]

Dependencies:
- [repo/service 1]
- [repo/service 2]

Error Handling:
- [error case 1]
- [error case 2]

Generate code dengan:
- Proper error handling
- Descriptive comments
- Following existing patterns
```

### 2. **Multi-turn Conversations**

Jangan expect perfect output di first try:

```
Turn 1: "Buatkan payment verification logic"
Turn 2: "Bagus, tapi tambahkan webhook signature verification"
Turn 3: "Perfect, sekarang add unit tests"
Turn 4: "Generate Swagger documentation untuk endpoint ini"
```

### 3. **Compare Approaches**

Minta AI compare different solutions:

```
"Untuk implement payment retry mechanism,
 apa pro/cons dari approach:

 1. Queue-based (Redis/Bull)
 2. Cron job
 3. Database polling

 Context project: [explain scale & requirements]"
```

### 4. **Code Review dengan AI**

```
"Review code ini dan kasih feedback:

[paste code]

Check for:
- Security vulnerabilities
- Performance issues
- Code smells
- Best practices violations
- Potential bugs

Rate 1-10 dan kasih specific improvements."
```

### 5. **Documentation Generation**

```
"Generate JSDoc comments untuk functions ini:

[paste code]

Include:
- Parameter descriptions dengan types
- Return value description
- Throws (possible errors)
- Example usage"
```

### 6. **Batch Processing**

Process multiple files sekaligus:

```
"Saya punya 5 use cases yang similar pattern.
 Ini template nya:

[paste template use case]

Tolong generate untuk:
1. CreateService
2. UpdateService
3. DeleteService
4. ApproveService
5. GetServiceById

Beda nya cuma di business logic: [explain differences]"
```

---

## 🚫 Limitations & Kapan JANGAN Pakai AI

### Kapan AI TIDAK Cocok:

#### 1. **Critical Security Implementation**
```
❌ "Generate encryption algorithm untuk payment data"
✅ Use established libraries (bcrypt, crypto)
   Consult security documentation
```

#### 2. **Complex Business Logic dari Domain Expert**
```
❌ Directly ask AI untuk business rules yang complex
✅ Konsultasi dengan product owner/domain expert dulu
   Baru minta AI implement based on clear requirements
```

#### 3. **Debugging Production Issues**
```
❌ Share production data/logs dengan AI
✅ Debug locally dengan sample data
   Ask AI dengan anonymized/sanitized examples
```

#### 4. **Architecture Decisions**
```
❌ "Choose architecture untuk entire system"
✅ AI bisa kasih options & considerations
   Final decision tetap tim/tech lead
```

### AI Limitations:

1. **No Real-time Codebase Access**
   - AI ga bisa directly access codebase
   - Harus manual paste code yang relevant

2. **Outdated Information**
   - Training data ada cutoff date
   - Latest library versions mungkin berbeda
   - Check official docs untuk confirmation

3. **Context Window Limitations**
   - Bisa lupa conversation history yang panjang
   - Paste context lagi jika perlu

4. **No Testing**
   - AI generate code tapi ga bisa run tests
   - YOU harus test sendiri

5. **Generic Solutions**
   - AI kasih general best practices
   - Harus adapt untuk specific project needs

---

## 📚 Resources

### Learning AI-Assisted Development:
- [OpenAI Best Practices](https://platform.openai.com/docs/guides/prompt-engineering)
- [Anthropic Prompt Engineering](https://docs.anthropic.com/claude/docs/prompt-engineering)
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)

### Security:
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [AI Security Best Practices](https://owasp.org/www-project-ai-security-and-privacy-guide/)

### Sequelize & Node.js:
- [Sequelize Documentation](https://sequelize.org/docs/v6/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## 🤝 Team Collaboration

### Sharing AI-Generated Code:

1. **Code Review Process:**
   ```
   - Mark PR dengan label "ai-assisted"
   - Include reasoning dalam PR description
   - Reviewer extra careful untuk AI-generated code
   ```

2. **Knowledge Sharing:**
   ```
   - Share successful prompts di team chat
   - Document di internal wiki
   - Update this guide dengan new learnings
   ```

3. **Quality Standards:**
   ```
   - AI-generated code harus pass semua tests
   - Follow existing code style
   - Complete documentation
   - No security vulnerabilities
   ```

---

## 📝 Checklist: Sebelum Commit AI-Generated Code

- [ ] Code sudah di-review line by line
- [ ] Business logic sesuai requirements
- [ ] Security vulnerabilities sudah di-check
- [ ] Error handling comprehensive
- [ ] Tests sudah dibuat dan pass
- [ ] Code follow project patterns
- [ ] Documentation/comments complete
- [ ] No hardcoded values/secrets
- [ ] Performance considerations addressed
- [ ] Linter & formatter pass

---

## 🎓 Conclusion

AI adalah tool yang powerful untuk speed up development, tapi **BUKAN magic solution**.

**Key Takeaways:**
1. ✅ Use AI untuk boost productivity
2. ✅ Always provide sufficient context
3. ✅ Review & understand AI output
4. ✅ Test everything thoroughly
5. ✅ Learn from AI, don't just copy
6. ✅ Keep security in mind
7. ✅ Collaborate & share knowledge

**Remember:**
> "AI makes you faster, but you make the decisions."

---

**Happy Coding with AI! 🚀**

*Last updated: 2024-11-02*
*Maintained by: SkillConnect Backend Team*

---

## 📞 Questions?

Kalau ada questions atau mau share AI development tips, diskusi di:
- Team Slack channel: #ai-development
- GitHub Discussions: [Link]

Contribute to this guide dengan create PR!
