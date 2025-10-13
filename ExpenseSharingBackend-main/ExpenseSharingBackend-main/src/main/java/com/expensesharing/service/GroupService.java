package com.expensesharing.service;

import com.expensesharing.dto.GroupDTO;
import com.expensesharing.entity.Group;
import com.expensesharing.exception.ResourceNotFoundException;
import com.expensesharing.repository.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GroupService {
    
    @Autowired
    private GroupRepository groupRepository;
    
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
    
    public GroupDTO createGroup(GroupDTO groupDTO) {
        Group group = new Group();
        group.setName(groupDTO.getName());
        group.setDescription(groupDTO.getDescription());
        group.setMembers(groupDTO.getMembers());
        
        Group savedGroup = groupRepository.save(group);
        return convertToDTO(savedGroup);
    }
    
    public List<GroupDTO> getAllGroups() {
        List<Group> groups = groupRepository.findAll();
        return groups.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public GroupDTO getGroupById(Long id) {
        Group group = groupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with id: " + id));
        return convertToDTO(group);
    }
    
    private GroupDTO convertToDTO(Group group) {
        return new GroupDTO(
                group.getId(),
                group.getName(),
                group.getDescription(),
                group.getMembers(),
                group.getCreatedAt().format(formatter)
        );
    }
}