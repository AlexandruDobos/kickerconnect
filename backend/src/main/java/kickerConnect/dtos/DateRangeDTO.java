package kickerConnect.dtos;

import lombok.Data;

import java.time.LocalDateTime;
@Data
public class DateRangeDTO {
    private LocalDateTime startDate;
    private LocalDateTime endDate;

}

