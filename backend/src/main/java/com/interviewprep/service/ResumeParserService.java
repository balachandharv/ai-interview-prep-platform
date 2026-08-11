package com.interviewprep.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import com.interviewprep.evaluation.service.OpenAiService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@Service
public class ResumeParserService {

    private final OpenAiService openAiService;

    public ResumeParserService(OpenAiService openAiService) {
        this.openAiService = openAiService;
    }

    public String extractTextFromPdf(MultipartFile file) throws IOException {
        try (PDDocument document = org.apache.pdfbox.Loader.loadPDF(file.getBytes())) {
            PDFTextStripper pdfStripper = new PDFTextStripper();
            return pdfStripper.getText(document);
        }
    }

    public String extractSkillsAndGenerateQuestions(MultipartFile file) throws IOException {
        String resumeText = extractTextFromPdf(file);
        
        // Truncate to avoid massive token costs if resume is huge
        if (resumeText.length() > 8000) {
            resumeText = resumeText.substring(0, 8000);
        }

        String prompt = "Extract the key skills and experiences from the following resume text. " +
                "Then, generate 3 personalized technical interview questions based on those skills.\n\n" +
                "Resume Text:\n" + resumeText;

        return openAiService.callOpenAiApi("You are an expert technical recruiter analyzing a resume.", prompt, 1000);
    }
}
