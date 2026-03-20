package com.gtwo.bdss_system.service.transfusion.impl;

import com.gtwo.bdss_system.dto.transfusion.RequestOwnerDTO;
import com.gtwo.bdss_system.dto.transfusion.TransfusionRequestDTO;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.transfusion.TransfusionRequest;
import com.gtwo.bdss_system.enums.Role;
import com.gtwo.bdss_system.enums.Status;
import com.gtwo.bdss_system.repository.transfusion.TransfusionRequestRepository;
import com.gtwo.bdss_system.service.transfusion.TransfusionRequestService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransfusionRequestServiceImpl implements TransfusionRequestService {

    private final TransfusionRequestRepository repository;
    private final ModelMapper modelMapper;

    public TransfusionRequestServiceImpl(TransfusionRequestRepository requestRepository, ModelMapper mapper) {
        this.repository = requestRepository;
        this.modelMapper = mapper;
    }

    @Override
    public List<RequestOwnerDTO> getAll() {
        return repository.findAll()
                .stream()
                .sorted(Comparator.comparing(TransfusionRequest::getRequestedAt).reversed())
                .map(this::toRequestOwnerDTO)
                .collect(Collectors.toList());
    }

    @Override
    public RequestOwnerDTO getById(Long id, Account currentUser) {
        TransfusionRequest request = getRequest(id);
        if (currentUser.getRole() == Role.MEMBER && !request.getOwner().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("Báº¡n khÃ´ng cÃ³ quyá»n truy cáº­p yÃªu cáº§u nÃ y");
        }
        return toRequestOwnerDTO(request);
    }

    @Override
    public TransfusionRequestDTO create(TransfusionRequestDTO dto, Account currentUser) {
        TransfusionRequest request = new TransfusionRequest();
        request.setRecipientName(dto.getRecipientName());
        request.setRecipientPhone(dto.getRecipientPhone());
        request.setDescription(dto.getDescription());
        request.setAddress(dto.getAddress());
        request.setRequestedAt(LocalDateTime.now());
        request.setStatus(Status.ACTIVE);
        request.setOwner(currentUser);
        repository.save(request);
        return modelMapper.map(request, TransfusionRequestDTO.class);
    }

    @Override
    public TransfusionRequestDTO update(Long id, TransfusionRequestDTO dto, Account currentUser) {
        TransfusionRequest request = getOwnedRequest(id, currentUser);
        request.setRecipientName(dto.getRecipientName());
        request.setRecipientPhone(dto.getRecipientPhone());
        request.setDescription(dto.getDescription());
        request.setAddress(dto.getAddress());
        repository.save(request);
        return modelMapper.map(request, TransfusionRequestDTO.class);
    }

    @Override
    public void delete(Long id, Account currentUser) {
        TransfusionRequest request = currentUser.getRole() == Role.MEMBER
                ? getOwnedRequest(id, currentUser)
                : getRequest(id);
        request.setStatus(Status.INACTIVE);
        repository.save(request);
    }

    @Override
    public void restore(Long id, Account currentUser) {
        TransfusionRequest request = getOwnedRequest(id, currentUser);
        request.setStatus(Status.ACTIVE);
        repository.save(request);
    }

    @Override
    public List<RequestOwnerDTO> getMyRequests(Account currentUser) {
        return repository.findByOwner(currentUser).stream()
                .sorted(Comparator.comparing(TransfusionRequest::getRequestedAt).reversed())
                .map(this::toRequestOwnerDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TransfusionRequestDTO> getView() {
        return repository.findByStatus(Status.ACTIVE).stream()
                .map(r -> modelMapper.map(r, TransfusionRequestDTO.class))
                .collect(Collectors.toList());
    }

    private TransfusionRequest getOwnedRequest(Long id, Account currentUser) {
        TransfusionRequest request = getRequest(id);
        if (!request.getOwner().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("Báº¡n khÃ´ng cÃ³ quyá»n truy cáº­p yÃªu cáº§u nÃ y");
        }
        return request;
    }

    private TransfusionRequest getRequest(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("KhÃ´ng tÃ¬m tháº¥y yÃªu cáº§u"));
    }

    private RequestOwnerDTO toRequestOwnerDTO(TransfusionRequest request) {
        RequestOwnerDTO dto = modelMapper.map(request, RequestOwnerDTO.class);
        if (request.getOwner() != null) {
            dto.setCreaterName(request.getOwner().getFullName());
        }
        return dto;
    }
}
