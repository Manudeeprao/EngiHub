package com.engihub.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long clientId;
    private String title;
    @Lob
    @Column(length = 2000)
    private String description;
    private String disciplines; // Comma-separated engineer types
    private String status = "Open"; // Default status
    private Double budget;
    private String startDate;
    private String endDate;

    // Constructors
    public Project() {
        this.status = "Open";
    }

    public Project(Long clientId, String title, String description, String disciplines, 
                   Double budget, String startDate, String endDate) {
        this.clientId = clientId;
        this.title = title;
        this.description = description;
        this.disciplines = disciplines;
        this.budget = budget;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = "Open";
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getDisciplines() { return disciplines; }
    public void setDisciplines(String disciplines) { this.disciplines = disciplines; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Double getBudget() { return budget; }
    public void setBudget(Double budget) { this.budget = budget; }
    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }
    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }

    @Override
    public String toString() {
        return "Project{" +
                "id=" + id +
                ", clientId=" + clientId +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", disciplines='" + disciplines + '\'' +
                ", status='" + status + '\'' +
                ", budget=" + budget +
                ", startDate='" + startDate + '\'' +
                ", endDate='" + endDate + '\'' +
                '}';
    }
}
