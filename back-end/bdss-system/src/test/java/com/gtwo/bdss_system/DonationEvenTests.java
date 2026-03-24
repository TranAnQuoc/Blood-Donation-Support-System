package com.gtwo.bdss_system;

import com.gtwo.bdss_system.dto.donation.DonationEventDTO;
import com.gtwo.bdss_system.entity.donation.DonationEvent;
import com.gtwo.bdss_system.enums.Status;
import com.gtwo.bdss_system.repository.donation.DonationEventRepository;
import com.gtwo.bdss_system.service.donation.DonationEventService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.AfterEachCallback;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.sql.Time;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Unit / Integration tests cho DonationEventService
 * Sử dụng @BeforeEach để khởi tạo dữ liệu mẫu trước mỗi test
 * và AfterEachCallback (implements) để dọn dữ liệu sau mỗi test.
 */
@SpringBootTest
@ActiveProfiles("test")
public class DonationEvenTests implements AfterEachCallback {

// =========================================================================
// Inject các bean cần thiết
// =========================================================================

    @Autowired
    private DonationEventService donationEventService;

    @Autowired
    private DonationEventRepository donationEventRepository;

// =========================================================================
// Các biến dùng chung trong test
// =========================================================================

    private DonationEventDTO validDTO;
    private DonationEvent savedEvent;

// =========================================================================
// Constructor khởi tạo đầy đủ (Autowired constructor injection)
// =========================================================================

    @Autowired
    public DonationEvenTests(DonationEventService donationEventService,
                             DonationEventRepository donationEventRepository) {
        this.donationEventService = donationEventService;
        this.donationEventRepository = donationEventRepository;
    }

// =========================================================================
// @BeforeEach: Khởi tạo dữ liệu mẫu trước mỗi test
// =========================================================================

    @BeforeEach
    void setUp() {
// --- Tạo DTO hợp lệ dùng chung ---
        validDTO = new DonationEventDTO();
        validDTO.setName("Hiến máu Bách Khoa");
        validDTO.setDate(LocalDate.now().plusDays(7));
        validDTO.setStartTime(Time.valueOf("08:00:00"));
        validDTO.setEndTime(Time.valueOf("12:00:00")); // 4 tiếng (>= 1h, hợp lệ)
        validDTO.setAddress("Đại học Bách Khoa Hà Nội");
        validDTO.setMaxSlot(200);

// --- Lưu một sự kiện mẫu vào DB test để dùng trong các test cần dữ liệu sẵn ---
        DonationEvent seed = new DonationEvent();
        seed.setName("Hiến máu Bách Khoa");
        seed.setDate(LocalDate.now().plusDays(7));
        seed.setStartTime(Time.valueOf("08:00:00"));
        seed.setEndTime(Time.valueOf("12:00:00"));
        seed.setMaxSlot(200);
        seed.setAddress("Đại học Bách Khoa Hà Nội");
        seed.setStatus(Status.ACTIVE);

        savedEvent = donationEventRepository.save(seed);
    }

// =========================================================================
// AfterEachCallback: Dọn dữ liệu sau mỗi test (implements interface)
// =========================================================================

    @Override
    public void afterEach(ExtensionContext context) {
// Xóa toàn bộ dữ liệu test để tránh ảnh hưởng lẫn nhau
        donationEventRepository.deleteAll();
    }

// =========================================================================
// @AfterEach: Cleanup bổ sung (log hoặc reset state)
// =========================================================================

    @AfterEach
    void tearDown() {
// Reset biến chung về null sau mỗi test
        validDTO = null;
        savedEvent = null;
        System.out.println("[TearDown] Dữ liệu test đã được dọn dẹp.");
    }

// =========================================================================
// TC_001: Tạo sự kiện hợp lệ => thành công
// =========================================================================

    @Test
    void tc001_createEvent_withValidData_shouldSucceed() {
// Tạo một DTO có tên khác để tránh duplicate với seed
        DonationEventDTO dto = new DonationEventDTO();
        dto.setName("Hiến máu Hà Nội 2026");
        dto.setDate(LocalDate.now().plusDays(5));
        dto.setStartTime(Time.valueOf("07:00:00"));
        dto.setEndTime(Time.valueOf("11:00:00"));
        dto.setAddress("Hội trường A1 - Đống Đa");
        dto.setMaxSlot(150);

        DonationEvent result = donationEventService.create(dto);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isNotNull();
        assertThat(result.getName()).isEqualTo("Hiến máu Hà Nội 2026");
        assertThat(result.getStatus()).isEqualTo(Status.ACTIVE);
    }

// =========================================================================
// TC_002: Tạo sự kiện có thời lượng < 1h => ném ngoại lệ
// =========================================================================

    @Test
    void tc002_createEvent_withShortDuration_shouldThrowException() {
        DonationEventDTO shortDTO = new DonationEventDTO();
        shortDTO.setName("Sự kiện Ngắn");
        shortDTO.setDate(LocalDate.now().plusDays(3));
        shortDTO.setStartTime(Time.valueOf("09:00:00"));
        shortDTO.setEndTime(Time.valueOf("09:30:00")); // Chỉ 30 phút
        shortDTO.setAddress("Cơ sở 2 - ĐHQG");
        shortDTO.setMaxSlot(50);

        assertThatThrownBy(() -> donationEventService.create(shortDTO))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Thời gian kết thúc phải sau thời gian bắt đầu ít nhất 1 tiếng");
    }

// =========================================================================
// TC_003: Tìm kiếm theo từ khóa => trả về đúng kết quả
// =========================================================================

    @Test
    void tc003_searchByName_shouldReturnMatchingEvents() {
        List<DonationEvent> result = donationEventService.searchByName("Bách Khoa");

        assertThat(result).isNotEmpty();
        assertThat(result).allMatch(e ->
                e.getName().toLowerCase().contains("bách khoa"));
    }

// =========================================================================
// TC_004: Xóa mềm sự kiện => status chuyển sang INACTIVE
// =========================================================================

    @Test
    void tc004_deleteEvent_shouldSetStatusInactive() {
        Long id = savedEvent.getId();

        donationEventService.delete(id);

        DonationEvent deleted = donationEventRepository.findById(id).orElseThrow();
        assertThat(deleted.getStatus()).isEqualTo(Status.INACTIVE);
    }

// =========================================================================
// TC_005: Truy vấn theo khoảng ngày => trả về sự kiện trong khoảng
// =========================================================================

    @Test
    void tc005_getByDateRange_shouldReturnEventsInRange() {
        LocalDate from = LocalDate.now().plusDays(1);
        LocalDate to = LocalDate.now().plusDays(30);

        List<DonationEvent> result = donationEventService.getByDateRange(from, to);

        assertThat(result).isNotEmpty();
        result.forEach(e -> {
            assertThat(e.getDate()).isAfterOrEqualTo(from);
            assertThat(e.getDate()).isBeforeOrEqualTo(to);
        });
    }

// =========================================================================
// TC_006: Tạo sự kiện trùng tên và địa chỉ => ném ngoại lệ
// =========================================================================

    @Test
    void tc006_createEvent_withDuplicateNameAndAddress_shouldThrowException() {
// validDTO trong @BeforeEach đã trùng tên/địa chỉ với savedEvent (seed)
// tc001 đã tạo thành công vì đặt tên khác. Ở đây ta thử dùng chính validDTO.
        assertThatThrownBy(() -> donationEventService.create(validDTO))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Lịch hiến máu với tên và địa chỉ này đã tồn tại");
    }

// =========================================================================
// TC_007: Cập nhật sự kiện hợp lệ => thành công
// =========================================================================

    @Test
    void tc007_updateEvent_successfully() {
        Long id = savedEvent.getId();
        DonationEventDTO updateDTO = new DonationEventDTO();
        updateDTO.setName("Tên đã đổi");
        updateDTO.setDate(savedEvent.getDate());
        updateDTO.setStartTime(savedEvent.getStartTime());
        updateDTO.setEndTime(savedEvent.getEndTime());
        updateDTO.setAddress(savedEvent.getAddress());
        updateDTO.setMaxSlot(500); // Đổi slot từ 200 lên 500

        DonationEvent result = donationEventService.update(id, updateDTO);

        assertThat(result.getName()).isEqualTo("Tên đã đổi");
        assertThat(result.getMaxSlot()).isEqualTo(500);
    }

// =========================================================================
// TC_008: Cập nhật sự kiện với thời lượng < 1h => ném ngoại lệ
// =========================================================================

    @Test
    void tc008_updateEvent_withShortDuration_shouldThrowException() {
        Long id = savedEvent.getId();
        DonationEventDTO shortDTO = new DonationEventDTO();
        shortDTO.setName(savedEvent.getName());
        shortDTO.setDate(savedEvent.getDate());
        shortDTO.setStartTime(Time.valueOf("08:00:00"));
        shortDTO.setEndTime(Time.valueOf("08:45:00")); // 45 phút
        shortDTO.setAddress(savedEvent.getAddress());
        shortDTO.setMaxSlot(200);

        assertThatThrownBy(() -> donationEventService.update(id, shortDTO))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Thời gian kết thúc phải sau thời gian bắt đầu ít nhất 1 tiếng");
    }

// =========================================================================
// TC_009: Lấy theo ID không tồn tại => ném ngoại lệ
// =========================================================================

    @Test
    void tc009_getById_withNonExistentId_shouldThrowException() {
        Long nonExistentId = 9999L;

        assertThatThrownBy(() -> donationEventService.getById(nonExistentId))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Không tìm thấy lịch hiến máu với ID: " + nonExistentId);
    }

// =========================================================================
// TC_010: Tự động hết hạn các sự kiện cũ => status chuyển sang INACTIVE
// =========================================================================

    @Test
    void tc10_autoExpirePastEvents_shouldMarkPastEventsInactive() {
// Tạo một sự kiện cũ trong quá khứ
        DonationEvent pastEvent = new DonationEvent();
        pastEvent.setName("Sự kiện hôm qua");
        pastEvent.setDate(LocalDate.now().minusDays(1));
        pastEvent.setStartTime(Time.valueOf("08:00:00"));
        pastEvent.setEndTime(Time.valueOf("11:00:00"));
        pastEvent.setAddress("Địa chỉ cũ");
        pastEvent.setStatus(Status.ACTIVE);
        pastEvent = donationEventRepository.save(pastEvent);

        donationEventService.autoExpirePastEvents();

        DonationEvent expired = donationEventRepository.findById(pastEvent.getId()).orElseThrow();
        assertThat(expired.getStatus()).isEqualTo(Status.INACTIVE);
    }
}
