# University Purpose Feature

## Overview
The onboarding process includes critical questions about university preferences that help Claude understand not just **what** students want to study, but **where** and **how** they want to learn.

## Key Questions

These questions appear in the **"University Purpose"** step (after preferences, before grades):

1. **University Main Purpose**: Theoretical knowledge vs. practical skills vs. balanced
2. **Campus Preference**: Campus bubble vs. big city integration
3. **Specialist vs. Generalist**: Deep expertise vs. broad interdisciplinary learning
4. **Learning Style**: Large lectures vs. small seminars
5. **Academic-Social Integration**: Integrated vs. separated life

## Why This Matters

### Same Field, Different Experiences
- **Software Engineering at MIT**: Theoretical, algorithm-focused, research-oriented
- **Software Engineering at CATO/Platanus**: Practical, project-based, startup-oriented
- **Software Engineering at UC Berkeley**: Balance of theory + Silicon Valley proximity

### The Questions Signal Student Fit

| Question Response | Indicates | Best University Types |
|------------------|-----------|----------------------|
| "Dominar conocimiento teórico profundo" | Research focus | MIT, Stanford, Caltech, Princeton |
| "Habilidades prácticas listas para trabajo" | Career focus | Bootcamps, vocational programs, industry-connected schools |
| "Burbuja universitaria" | Immersive campus life | Residential colleges (Princeton, Dartmouth) |
| "Campus en ciudad grande" | Urban integration | Columbia, Berkeley, U. de Chile, NYU |
| "Experto en especialidad" | Deep specialization | Technical programs, focused majors |
| "Generalista" | Interdisciplinary | Liberal arts colleges, flexible programs |
| "Clases grandes con profesores famosos" | Research university | Large R1 universities |
| "Seminarios pequeños" | Personalized attention | Liberal arts colleges, small programs |

## Implementation Details

### 1. Questions Definition
**File**: `/lib/onboarding-questions.ts`
- Defines `UniversityPurposeQuestionId` type
- Exports `UNIVERSITY_PURPOSE_QUESTIONS` array
- Includes `createEmptyUniversityPurposeResponses()` helper

### 2. Onboarding Flow
**File**: `/components/onboarding/onboarding-modal.tsx`
- **Step 4** in the flow: `"universityPurpose"`
- Appears after preferences, before grades
- Uses `UniversityPurposeStep` component
- All questions must be answered to proceed

### 3. API Analysis
**File**: `/app/api/analyze-responses/route.ts`
- Receives `universityPurposeResponses` in request body
- Creates `universityPurposeContext` from responses
- Includes detailed prompt guidance about university fit

### 4. Enhanced Prompt
The AI prompt now includes:
- **5 detailed sections** explaining how each question type maps to university recommendations
- **Explicit instructions** to consider university fit in pathway recommendations
- **Examples** (MIT vs. CATO for Software Engineering)
- **Guidance** to mention specific program types in rationale

## How It Works in Practice

### User Flow
1. Student answers university purpose questions
2. Responses are sent to Claude along with other profile data
3. Claude analyzes ALL responses together
4. Claude recommends 3 pathways that consider:
   - Student's interests and skills
   - Work style preferences
   - **University environment fit**
   - **Learning style alignment**
   - **Career trajectory preferences**

### Example Analysis Output
```json
{
  "pathways": [
    {
      "name": "Ingeniería de Software",
      "rationale": "Tu fuerte rendimiento en matemáticas y programación, combinado con tu preferencia por conocimiento teórico profundo y seminarios pequeños, sugiere que prosperarías en un programa de CS riguroso en una universidad de investigación como MIT o Stanford. Tu deseo de una burbuja universitaria también se alinea con estos entornos residenciales enfocados.",
      "actionSteps": [...],
      "timeline": "18-24 meses"
    }
  ]
}
```

## Benefits

### For Students
- More personalized pathway recommendations
- Better understanding of university fit
- Clearer picture of learning environment preferences
- Aligned expectations about academic vs. practical focus

### For Claude's Analysis
- Richer context for recommendations
- Ability to distinguish between different types of programs
- Better alignment with student's learning style
- More nuanced career pathway suggestions

## Testing

To test this feature:
1. Complete onboarding and pay attention to the "University Purpose" step
2. Try different combinations of responses
3. Check if the pathway rationales mention:
   - University types
   - Learning environments
   - Program characteristics
4. Verify that recommendations align with stated preferences

## Future Enhancements

Potential improvements:
- Add specific university recommendations to pathways
- Create university comparison tool based on preferences
- Link to programs that match their profile
- Provide scholarship opportunities for preferred university types
- Generate personalized application strategy based on preferences

---

**Last Updated**: November 23, 2025
**Status**: Implemented and Active ✅

