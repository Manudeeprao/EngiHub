package com.engihub.backend.dto;

public class EngineerDTO {
    private Long id;
    private Long userId;
    private String name;
    private String specialization;
    private int experience;
    private String bio;

    public EngineerDTO() {}

    public EngineerDTO(Long id, Long userId, String name, String specialization, int experience, String bio) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.specialization = specialization;
        this.experience = experience;
        this.bio = bio;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public int getExperience() { return experience; }
    public void setExperience(int experience) { this.experience = experience; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
}
