package kickerConnect.dtos;

import lombok.Data;

import java.time.LocalDateTime;
@Data
public class ComplaintDTO {
    private int id;
    private String creator;
    private String content;
    private LocalDateTime launchedTime;
    private LocalDateTime resolvedTime;
    private boolean isResolved;
}
