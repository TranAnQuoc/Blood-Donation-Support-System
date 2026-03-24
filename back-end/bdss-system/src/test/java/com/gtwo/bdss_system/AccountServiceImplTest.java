package com.gtwo.bdss_system;

import com.gtwo.bdss_system.dto.auth.AccountCreateDTO;
import com.gtwo.bdss_system.entity.auth.Account;
import com.gtwo.bdss_system.entity.commons.BloodType;
import com.gtwo.bdss_system.enums.Gender;
import com.gtwo.bdss_system.enums.Role;
import com.gtwo.bdss_system.enums.Status;
import com.gtwo.bdss_system.enums.StatusDonation;
import com.gtwo.bdss_system.repository.auth.AccountRepository;
import com.gtwo.bdss_system.repository.commons.BloodTypeRepository;
import com.gtwo.bdss_system.repository.donation.DonationHistoryRepository;
import com.gtwo.bdss_system.service.auth.impl.AccountServiceImpl;
import com.gtwo.bdss_system.service.commons.EmailService;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.sql.Date;
import java.time.LocalDate;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AccountServiceImplTest {

    @Mock
    private AccountRepository accountRepo;

    @Mock
    private BloodTypeRepository bloodTypeRepo;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private ModelMapper modelMapper;

    @Mock
    private EmailService emailService;

    @Mock
    private DonationHistoryRepository donationHistoryRepository;

    @InjectMocks
    private AccountServiceImpl accountService;

    private Validator validator;
    private Account testAccount;
    private BloodType testBloodType;
    private AccountCreateDTO validAccountCreateDTO;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();

        testBloodType = new BloodType();
        testBloodType.setId(1L);
        testBloodType.setType("O");
        testBloodType.setRhFactor("+");

        testAccount = new Account();
        testAccount.setId(100L);
        testAccount.setEmail("testadmin@gmail.com");
        testAccount.setPhone("0123456789");
        testAccount.setCCCD("012345678912");
        testAccount.setFullName("Lê Văn Tuấn");
        testAccount.setGender(Gender.MALE);
        testAccount.setRole(Role.ADMIN);
        testAccount.setBloodType(testBloodType);
        testAccount.setStatus(Status.ACTIVE);
        testAccount.setStatusDonation(StatusDonation.INACTIVE);

        validAccountCreateDTO = new AccountCreateDTO();
        validAccountCreateDTO.setSubject("Tạo mới Account");
        validAccountCreateDTO.setEmailOwner("admin@gmail.com");
        validAccountCreateDTO.setEmail("newstaff@gmail.com");
        validAccountCreateDTO.setPhone("0987654321");
        validAccountCreateDTO.setCCCD("123456789012");
        validAccountCreateDTO.setFullName("Nguyễn Văn A");
        validAccountCreateDTO.setPassword("password123");
        validAccountCreateDTO.setGender(Gender.MALE);
        validAccountCreateDTO.setDateOfBirth(Date.valueOf(LocalDate.of(2000, 1, 1)));
        validAccountCreateDTO.setRole(Role.STAFF);
        validAccountCreateDTO.setBloodTypeId(1L);
        validAccountCreateDTO.setAddress("Hà Nội");
    }

    @AfterEach
    void tearDown() {
        reset(accountRepo, bloodTypeRepo, passwordEncoder, modelMapper, emailService, donationHistoryRepository);
        testAccount = null;
        testBloodType = null;
        validAccountCreateDTO = null;
    }

    private void assertValidationMessage(AccountCreateDTO dto, String expectedMessage) {
        Set<ConstraintViolation<AccountCreateDTO>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty(), "Khong tim thay loi validation nao");
        boolean containsMessage = violations.stream()
                .anyMatch(v -> v.getMessage().equals(expectedMessage));
        assertTrue(containsMessage, "Khong tim thay thong bao loi mong muon: " + expectedMessage);
    }

    // ==========================================
    // CÁC TEST CASE CHO METHOD createByAdmin
    // Đảm bảo 100% Branch Coverage (Exceptions & Success)
    // ==========================================

    @Test
    void _UC01() {
        validAccountCreateDTO.setRole(Role.MEMBER);
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> accountService.createByAdmin(validAccountCreateDTO));
        assertEquals("Quản trị viên không được tạo tài khoản MEMBER", exception.getMessage());
    }

    @Test
    void _UC02() {
        when(accountRepo.existsByEmail(validAccountCreateDTO.getEmail())).thenReturn(true);
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> accountService.createByAdmin(validAccountCreateDTO));
        assertEquals("Email đã được sử dụng", exception.getMessage());
    }

    @Test
    void _UC03() {
        when(accountRepo.existsByPhone(validAccountCreateDTO.getPhone())).thenReturn(true);
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> accountService.createByAdmin(validAccountCreateDTO));
        assertEquals("Số điện thoại đã được sử dụng", exception.getMessage());
    }

    @Test
    void _UC04() {
        when(accountRepo.existsByCCCD(validAccountCreateDTO.getCCCD())).thenReturn(true);
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> accountService.createByAdmin(validAccountCreateDTO));
        assertEquals("CCCD đã được sử dụng", exception.getMessage());
    }

    @Test
    void _UC05() {
        validAccountCreateDTO.setCCCD(null);
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> accountService.createByAdmin(validAccountCreateDTO));
        assertEquals("CCCD phải có đúng 12 chữ số", exception.getMessage());
    }

    @Test
    void _UC06() {
        validAccountCreateDTO.setCCCD("1234");
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> accountService.createByAdmin(validAccountCreateDTO));
        assertEquals("CCCD phải có đúng 12 chữ số", exception.getMessage());
    }

    @Test
    void _UC07() {
        when(bloodTypeRepo.findById(validAccountCreateDTO.getBloodTypeId())).thenReturn(Optional.empty());
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> accountService.createByAdmin(validAccountCreateDTO));
        assertEquals("bloodTypeId|Nhóm máu không hợp lệ", exception.getMessage());
    }

    @Test
    void _UC08() {
        when(bloodTypeRepo.findById(validAccountCreateDTO.getBloodTypeId())).thenReturn(Optional.of(testBloodType));
        when(passwordEncoder.encode(validAccountCreateDTO.getPassword())).thenReturn("encodedPassword");

        assertDoesNotThrow(() -> accountService.createByAdmin(validAccountCreateDTO));

        verify(accountRepo, times(1)).save(any(Account.class));
    }
    

    // ==========================================
    // CÁC TEST CASE VALIDATE MESSAGES TỪ DTO (@Email, @NotBlank...)
    // ==========================================

    @Test
    void _UC09() {
        validAccountCreateDTO.setEmailOwner(null);
        assertValidationMessage(validAccountCreateDTO, "Email người tạo là bắt buộc");
    }

    @Test
    void _UC10() {
        validAccountCreateDTO.setEmailOwner("invalid-email");
        assertValidationMessage(validAccountCreateDTO, "Email người tạo không đúng định dạng");
    }

    @Test
    void _UC11() {
        validAccountCreateDTO.setEmail(null);
        assertValidationMessage(validAccountCreateDTO, "Email là bắt buộc");
    }

    @Test
    void _UC12() {
        validAccountCreateDTO.setEmail("invalid-email");
        assertValidationMessage(validAccountCreateDTO, "Email không đúng định dạng");
    }

    @Test
    void _UC13() {
        validAccountCreateDTO.setPassword(null);
        assertValidationMessage(validAccountCreateDTO, "Mật khẩu là bắt buộc");
    }

    @Test
    void _UC14() {
        validAccountCreateDTO.setCCCD(null);
        assertValidationMessage(validAccountCreateDTO, "CCCD là bắt buộc");
    }

    @Test
    void _UC15() {
        validAccountCreateDTO.setCCCD("12345");
        assertValidationMessage(validAccountCreateDTO, "CCCD phải có đúng 12 chữ số");
    }

    @Test
    void _UC16() {
        validAccountCreateDTO.setFullName(null);
        assertValidationMessage(validAccountCreateDTO, "Họ và tên là bắt buộc");
    }

    @Test
    void _UC17() {
        validAccountCreateDTO.setGender(null);
        assertValidationMessage(validAccountCreateDTO, "Giới tính là bắt buộc");
    }

    @Test
    void _UC18() {
        validAccountCreateDTO.setRole(null);
        assertValidationMessage(validAccountCreateDTO, "Vai trò là bắt buộc");
    }

    @Test
    void _UC19() {
        validAccountCreateDTO.setBloodTypeId(null);
        assertValidationMessage(validAccountCreateDTO, "Nhóm máu là bắt buộc");
    }

    @Test
    void _UC20() {
        validAccountCreateDTO.setDateOfBirth(null);
        assertValidationMessage(validAccountCreateDTO, "Ngày sinh là bắt buộc");
    }

    @Test
    void _UC21() {
        validAccountCreateDTO.setDateOfBirth(Date.valueOf(LocalDate.now().plusDays(10)));
        assertValidationMessage(validAccountCreateDTO, "Ngày sinh phải là ngày trong quá khứ");
    }

    @Test
    void _UC22() {
        validAccountCreateDTO.setPhone(null);
        assertValidationMessage(validAccountCreateDTO, "Số điện thoại là bắt buộc");
    }

    @Test
    void _UC23() {
        validAccountCreateDTO.setPhone("09");
        assertValidationMessage(validAccountCreateDTO, "Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số");
    }

    @Test
    void _UC24() {
        validAccountCreateDTO.setAddress(null);
        assertValidationMessage(validAccountCreateDTO, "Địa chỉ là bắt buộc");
    }
}