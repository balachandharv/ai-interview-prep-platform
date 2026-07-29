package com.interviewprep.seeder;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewprep.company.entity.Company;
import com.interviewprep.company.repository.CompanyRepository;
import com.interviewprep.question.entity.Question;
import com.interviewprep.question.repository.QuestionRepository;
import com.interviewprep.roleplay.entity.Persona;
import com.interviewprep.roleplay.repository.PersonaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final QuestionRepository questionRepository;
    private final PersonaRepository personaRepository;
    private final CompanyRepository companyRepository;
    private final ObjectMapper objectMapper;

    @Override
    public void run(String... args) throws Exception {
        if (questionRepository.count() == 0) {
            log.info("Seeding questions database...");
            seedQuestions();
        }
        if (personaRepository.count() == 0) {
            log.info("Seeding personas database...");
            seedPersonas();
        }
        if (companyRepository.count() == 0) {
            log.info("Seeding companies database...");
            seedCompanies();
        }
        log.info("Database seeding complete.");
    }

    private void seedQuestions() throws Exception {
        try {
            Resource resource = new ClassPathResource("data/seed-questions.json");
            if (resource.exists()) {
                List<Question> questions = objectMapper.readValue(
                    resource.getInputStream(),
                    new TypeReference<List<Question>>() {});
                questionRepository.saveAll(questions);
                log.info("Seeded {} questions", questions.size());
            }
        } catch (Exception e) {
            log.warn("Could not seed questions: {}", e.getMessage());
        }
    }

    private void seedCompanies() {
        try {
            Resource resource = new ClassPathResource("data/seed-companies.json");
            if (resource.exists()) {
                List<Company> companies = objectMapper.readValue(
                    resource.getInputStream(),
                    new TypeReference<List<Company>>() {});
                companyRepository.saveAll(companies);
                log.info("Seeded {} companies", companies.size());
            }
        } catch (Exception e) {
            log.warn("Could not seed companies: {}", e.getMessage());
        }
    }

    private void seedPersonas() {
        List<Persona> personas = List.of(
            buildPersona("Priya Sharma", "Senior Software Engineer",
                "Google", "Technical", "Hard", 45,
                "You are Priya Sharma, Senior SWE at Google. " +
                "Ask deep technical questions. Focus on algorithms, system design, " +
                "and scalability. Be professional but warm."),
            buildPersona("David Chen", "Engineering Manager",
                "Amazon", "Behavioral", "Medium", 40,
                "You are David Chen, EM at Amazon. " +
                "Focus on leadership principles. Ask behavioral questions. " +
                "Probe for specific examples using STAR method."),
            buildPersona("Sarah Johnson", "HR Business Partner",
                "Microsoft", "HR", "Easy", 30,
                "You are Sarah Johnson, HRBP at Microsoft. " +
                "Ask about culture fit, career goals, and soft skills. " +
                "Be friendly and encouraging."),
            buildPersona("Rahul Gupta", "CTO",
                "Tech Startup", "Mixed", "Hard", 60,
                "You are Rahul Gupta, CTO of a fast-growing startup. " +
                "Ask about full-stack skills, problem solving under pressure, " +
                "and startup mindset."),
            buildPersona("Jennifer Lee", "Technical Recruiter",
                "Meta", "Technical", "Medium", 45,
                "You are Jennifer Lee, Technical Recruiter at Meta. " +
                "Focus on coding fundamentals, past projects, " +
                "and technical depth."),
            buildPersona("Michael Brown", "Staff Engineer",
                "Netflix", "System Design", "Hard", 60,
                "You are Michael Brown, Staff Engineer at Netflix. " +
                "Deep dive into system design, architecture decisions, " +
                "and engineering tradeoffs.")
        );
        personaRepository.saveAll(personas);
    }

    private Persona buildPersona(String name, String role, String company, String style, String diff, int dur, String prompt) {
        Persona p = new Persona();
        p.setName(name);
        p.setRole(role);
        p.setCompany(company);
        p.setInterviewStyle(style);
        p.setDifficulty(diff);
        p.setEstimatedDurationMinutes(dur);
        p.setSystemPrompt(prompt);
        p.setActive(true);
        return p;
    }
}
