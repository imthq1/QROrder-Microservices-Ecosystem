package com.example.MenuService.Controller;


import com.example.MenuService.Domain.ReqDTO.TableRequest;
import com.example.MenuService.Domain.ResDTO.TableResponse;
import com.example.MenuService.Service.TableService;
import com.google.zxing.WriterException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/tables")
@RequiredArgsConstructor
public class TableController {

    private final TableService tableService;

    @PostMapping
    public ResponseEntity<TableResponse> createTable(@RequestBody TableRequest request)
            throws WriterException, IOException {
        TableResponse response = tableService.createTable(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/qr-code")
    public ResponseEntity<TableResponse> generateNewQRCode(@PathVariable String idTable)
            throws WriterException, IOException {
        TableResponse response = tableService.generateQRCode(idTable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TableResponse> getTable(@PathVariable int id)
            throws WriterException, IOException {
        TableResponse response = tableService.getTableWithQRImage(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<TableResponse>> getAllTables()
            throws WriterException, IOException {
        List<TableResponse> tables = tableService.getAllTablesWithQR();
        return ResponseEntity.ok(tables);
    }
}