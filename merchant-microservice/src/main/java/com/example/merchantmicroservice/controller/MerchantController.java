package com.example.merchantmicroservice.controller;

import com.example.merchantmicroservice.mappers.MerchantMapper;
import com.example.merchantmicroservice.model.dto.MerchantInputDTO;
import com.example.merchantmicroservice.model.dto.MerchantOutputDTO;
import com.example.merchantmicroservice.service.MerchantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

/**
 * REST controller for managing merchants.
 */
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/merchants")
@RequiredArgsConstructor
public class MerchantController {
    private final MerchantService merchantService;
    private final MerchantMapper merchantMapper;


    /**
     * Creates a new merchant.
     *
     * @param merchantInputDTO the merchant input data transfer object
     * @return the response entity with the created merchant output data transfer object
     */
    @PostMapping
    public ResponseEntity<MerchantOutputDTO> createMerchant(@Valid @RequestBody MerchantInputDTO merchantInputDTO) {
        return ResponseEntity.ok(merchantMapper.toDto(merchantService.createMerchant(merchantInputDTO)));
    }

    /**
     * Finds all merchants.
     */
    @GetMapping("/all")
    public ResponseEntity<List<MerchantOutputDTO>> findAll() {
        return ResponseEntity.ok(merchantService.findAll().stream()
                .map(merchantMapper::toDto)
                .collect(Collectors.toList()));
    }

    /**
     * Finds a merchant by ID.
     *
     * @param id the merchant ID
     * @param simpleOutput whether to return a simplified output
     * @return the response entity with the found merchant output data transfer object
     */
    @GetMapping("/{id}")
    public ResponseEntity<MerchantOutputDTO> findById(@Valid @PathVariable String id, @RequestParam(required = false) boolean simpleOutput) {
        return ResponseEntity.ok(merchantMapper.toDto(merchantService.findById(id, simpleOutput)));
    }

    /**
     * Finds merchants by name.
     *
     * @param name the merchant name
     * @return the response entity with the list of found merchant output data transfer objects
     */
    @GetMapping("/search")
    public ResponseEntity<List<MerchantOutputDTO>> findByName(@Valid @RequestParam String name) {
        return ResponseEntity.ok(merchantService.findByName(name).stream()
                .map(merchantMapper::toDto)
                .collect(Collectors.toList()));
    }

    /**
     * Updates a merchant.
     *
     * @param id the merchant ID
     * @param merchantInputDTO the merchant input data transfer object
     * @return the response entity with the updated merchant output data transfer object
     */
    @PutMapping("/{id}")
    public ResponseEntity<MerchantOutputDTO> updateMerchant(@Valid @PathVariable String id, @RequestBody MerchantInputDTO merchantInputDTO) {
        return ResponseEntity.ok(merchantMapper.toDto(merchantService.updateMerchant(id, merchantInputDTO)));
    }

    /**
     * Finds merchants by client ID.
     *
     * @param clientId the client ID
     * @return the response entity with the list of found merchant output data transfer objects
     */
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<MerchantOutputDTO>> findByClientId(@Valid @PathVariable String clientId) {
        return ResponseEntity.ok(merchantService.findByClientId(clientId).stream()
                .map(merchantMapper::toDto)
                .collect(Collectors.toList()));
    }

    /**
     * Finds the client by merchant ID.
     *
     * @param merchantId the merchant ID
     * @return the response entity with the client ID
     */
    @GetMapping("/{merchantId}/client")
    public ResponseEntity<String> findClientByMerchantId(@Valid @PathVariable String merchantId) {
        return ResponseEntity.ok(merchantService.findClientByMerchantId(merchantId));
    }
}