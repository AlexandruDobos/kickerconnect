package kickerConnect.utilities;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ErrorInfo {

    private Integer errorCode;

    private String errorMessage;

    private LocalDateTime timeStamp;
}