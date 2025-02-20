package com.example.merchantmicroservice.controller;

import com.example.merchantmicroservice.model.dto.MerchantInputDTO;
import com.example.merchantmicroservice.model.dto.MerchantOutputDTO;
import com.example.merchantmicroservice.service.MerchantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/merchants")
@RequiredArgsConstructor
public class MerchantController {
    private final MerchantService merchantService;

    @PostMapping
    public ResponseEntity<MerchantOutputDTO> createMerchant(@Valid @RequestBody MerchantInputDTO merchantInputDTO) {
        return ResponseEntity.ok(merchantService.createMerchant(merchantInputDTO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MerchantOutputDTO> findById(@Valid @PathVariable String id, @RequestParam(required = false) boolean simpleOutput) {
        return ResponseEntity.ok(merchantService.findById(id, simpleOutput));
    }

    @GetMapping("/search")
    public ResponseEntity<List<MerchantOutputDTO>> findByName(@Valid @RequestParam String name) {
        return ResponseEntity.ok(merchantService.findByName(name));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MerchantOutputDTO> updateMerchant(@Valid @PathVariable String id, @RequestBody MerchantInputDTO merchantInputDTO) {
        return ResponseEntity.ok(merchantService.updateMerchant(id, merchantInputDTO));
    }
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<MerchantOutputDTO>> findByClientId(@Valid @PathVariable String clientId) {
        return ResponseEntity.ok(merchantService.findByClientId(clientId));
    }
    @GetMapping("/{merchantId}/client")
    public ResponseEntity<String> findClientByMerchantId(@Valid  @PathVariable String merchantId) {
        return ResponseEntity.ok(merchantService.findClientByMerchantId(merchantId));
    }
    
}