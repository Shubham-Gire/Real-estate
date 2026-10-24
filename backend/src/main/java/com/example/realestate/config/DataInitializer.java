package com.example.realestate.config;

import com.example.realestate.amenity.Amenity;
import com.example.realestate.amenity.AmenityRepository;
import com.example.realestate.category.CategoryRepository;
import com.example.realestate.category.PropertyCategory;
import com.example.realestate.inquiry.Inquiry;
import com.example.realestate.inquiry.InquiryRepository;
import com.example.realestate.inquiry.InquiryStatus;
import com.example.realestate.property.*;
import com.example.realestate.propertyimage.PropertyImage;
import com.example.realestate.user.Role;
import com.example.realestate.user.User;
import com.example.realestate.user.UserRepository;
import com.example.realestate.user.UserStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final CategoryRepository categoryRepository;
    private final AmenityRepository amenityRepository;
    private final InquiryRepository inquiryRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email:admin@estatehub.com}")
    private String adminEmail;

    @Value("${app.admin.password:AdminSecure2026!}")
    private String adminPassword;

    @Value("${app.admin.first-name:System}")
    private String adminFirstName;

    @Value("${app.admin.last-name:Administrator}")
    private String adminLastName;

    public DataInitializer(
            UserRepository userRepository,
            PropertyRepository propertyRepository,
            CategoryRepository categoryRepository,
            AmenityRepository amenityRepository,
            InquiryRepository inquiryRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.propertyRepository = propertyRepository;
        this.categoryRepository = categoryRepository;
        this.amenityRepository = amenityRepository;
        this.inquiryRepository = inquiryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        bootstrapAdminUser();
        bootstrapDemoData();
    }

    private void bootstrapAdminUser() {
        if (!userRepository.existsByEmailIgnoreCase(adminEmail)) {
            User admin = new User(
                    adminEmail.toLowerCase().trim(),
                    passwordEncoder.encode(adminPassword),
                    adminFirstName,
                    adminLastName,
                    Role.ROLE_ADMIN
            );
            admin.setStatus(UserStatus.ACTIVE);
            admin.setPhone("+1-800-ESTATE");
            admin.setBio("Chief System Administrator and Platform Supervisor");
            userRepository.save(admin);
            logger.info(">>> Initial Administrator bootstrapped: {}", adminEmail);
        }
    }

    private void bootstrapDemoData() {
        // Create demo agent and buyer if absent
        User agent = userRepository.findByEmailIgnoreCase("agent.john@estatehub.com").orElseGet(() -> {
            User u = new User("agent.john@estatehub.com", passwordEncoder.encode("Agent1234!"), "John", "Sterling", Role.ROLE_AGENT);
            u.setPhone("+1-415-555-0144");
            u.setAgencyName("Sterling & Co. Luxury Real Estate");
            u.setLicenseNumber("CAL-RE-889921");
            u.setBio("Premier luxury residential specialist with over 12 years representing distinguished properties.");
            u.setAvatarUrl("https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80");
            return userRepository.save(u);
        });

        User buyer = userRepository.findByEmailIgnoreCase("buyer.alice@estatehub.com").orElseGet(() -> {
            User u = new User("buyer.alice@estatehub.com", passwordEncoder.encode("User1234!"), "Alice", "Montgomery", Role.ROLE_USER);
            u.setPhone("+1-212-555-0182");
            u.setBio("Architectural enthusiast looking for urban sanctuaries and historical townhomes.");
            u.setAvatarUrl("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80");
            return userRepository.save(u);
        });

        User owner = userRepository.findByEmailIgnoreCase("owner.david@estatehub.com").orElseGet(() -> {
            User u = new User("owner.david@estatehub.com", passwordEncoder.encode("Owner1234!"), "David", "Kowalski", Role.ROLE_USER);
            u.setPhone("+1-305-555-0199");
            u.setBio("Private property investor with modern residential listings.");
            return userRepository.save(u);
        });

        // If properties table is empty, seed diverse realistic properties
        if (propertyRepository.count() == 0) {
            List<PropertyCategory> categories = categoryRepository.findAll();
            List<Amenity> allAmenities = amenityRepository.findAll();

            PropertyCategory aptCat = categories.stream().filter(c -> c.getSlug().equals("apartments")).findFirst().orElse(null);
            PropertyCategory villaCat = categories.stream().filter(c -> c.getSlug().equals("villas")).findFirst().orElse(null);
            PropertyCategory houseCat = categories.stream().filter(c -> c.getSlug().equals("houses")).findFirst().orElse(null);
            PropertyCategory officeCat = categories.stream().filter(c -> c.getSlug().equals("offices")).findFirst().orElse(null);
            PropertyCategory penthouseCat = categories.stream().filter(c -> c.getSlug().equals("penthouses")).findFirst().orElse(null);

            // 1. Luxury Skyline Penthouse (New York)
            Property p1 = new Property();
            p1.setOwner(agent);
            p1.setCategory(penthouseCat != null ? penthouseCat : aptCat);
            p1.setTitle("The Crown Penthouse at Hudson Yards");
            p1.setDescription("Perched high above Manhattan, this trophy duplex penthouse features 360-degree skyline views, soaring 14-foot ceilings, bespoke Italian marble finishes, and a private wraparound terrace overlooking the Hudson River. Includes private elevator entrance, custom smart-home climate and lighting controls, and 24-hour concierge service.");
            p1.setTransactionType(TransactionType.SALE);
            p1.setPropertyType(PropertyType.APARTMENT);
            p1.setStatus(PropertyStatus.PUBLISHED);
            p1.setPrice(new BigDecimal("4250000.00"));
            p1.setCity("New York");
            p1.setLocality("Hudson Yards, Manhattan");
            p1.setPostalCode("10001");
            p1.setAddress("500 West 33rd Street, PH-B");
            p1.setBedrooms(4);
            p1.setBathrooms(5);
            p1.setBuiltUpSqft(new BigDecimal("4800.00"));
            p1.setCarpetSqft(new BigDecimal("4500.00"));
            p1.setFloorNumber(72);
            p1.setTotalFloors(75);
            p1.setFurnishingStatus("FULLY_FURNISHED");
            p1.setParkingAvailable(true);
            p1.setFeatured(true);
            p1.setViewCount(342);
            p1.setAvailabilityDate(LocalDate.now().plusDays(15));
            p1.setAmenities(new HashSet<>(allAmenities.subList(0, Math.min(8, allAmenities.size()))));

            p1.addImage(new PropertyImage(p1, "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80", "seed-p1-1", 1, true));
            p1.addImage(new PropertyImage(p1, "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=80", "seed-p1-2", 2, false));
            p1.addImage(new PropertyImage(p1, "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=400&q=80", "seed-p1-3", 3, false));
            propertyRepository.save(p1);

            // 2. Mediterranean Waterfront Villa (Miami)
            Property p2 = new Property();
            p2.setOwner(agent);
            p2.setCategory(villaCat);
            p2.setTitle("Modern Coastal Waterfront Sanctuary");
            p2.setDescription("An architectural marvel in exclusive Coconut Grove boasting 100 feet of prime deep-water frontage with private yacht dockage. Open-concept light-filled spaces seamlessly merge indoor luxury with outdoor tropical living, complete with an infinity-edge saltwater pool, summer kitchen, and lush privacy gardens.");
            p2.setTransactionType(TransactionType.SALE);
            p2.setPropertyType(PropertyType.VILLA);
            p2.setStatus(PropertyStatus.PUBLISHED);
            p2.setPrice(new BigDecimal("3600000.00"));
            p2.setCity("Miami");
            p2.setLocality("Coconut Grove");
            p2.setPostalCode("33133");
            p2.setAddress("3420 Bayshore Boulevard");
            p2.setBedrooms(5);
            p2.setBathrooms(6);
            p2.setBuiltUpSqft(new BigDecimal("6200.00"));
            p2.setCarpetSqft(new BigDecimal("5800.00"));
            p2.setFloorNumber(1);
            p2.setTotalFloors(2);
            p2.setFurnishingStatus("SEMI_FURNISHED");
            p2.setParkingAvailable(true);
            p2.setFeatured(true);
            p2.setViewCount(289);
            p2.setAvailabilityDate(LocalDate.now());
            p2.setAmenities(new HashSet<>(allAmenities.subList(0, Math.min(10, allAmenities.size()))));

            p2.addImage(new PropertyImage(p2, "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=400&q=80", "seed-p2-1", 1, true));
            p2.addImage(new PropertyImage(p2, "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80", "seed-p2-2", 2, false));
            propertyRepository.save(p2);

            // 3. Contemporary Urban Loft for Rent (San Francisco)
            Property p3 = new Property();
            p3.setOwner(owner);
            p3.setCategory(aptCat);
            p3.setTitle("Designer Loft with Bay & Skyline Views");
            p3.setDescription("Stylishly appointed loft in vibrant SoMa with high exposed concrete ceilings, floor-to-ceiling soundproof windows, and custom chef's kitchen with Bosch appliances. Building amenities include a panoramic rooftop terrace, dog park, and state-of-the-art fitness center.");
            p3.setTransactionType(TransactionType.RENT);
            p3.setPropertyType(PropertyType.APARTMENT);
            p3.setStatus(PropertyStatus.PUBLISHED);
            p3.setPrice(new BigDecimal("4800.00"));
            p3.setDeposit(new BigDecimal("4800.00"));
            p3.setCity("San Francisco");
            p3.setLocality("SoMa / Financial District");
            p3.setPostalCode("94103");
            p3.setAddress("450 Folsom Street, Unit 1804");
            p3.setBedrooms(2);
            p3.setBathrooms(2);
            p3.setBuiltUpSqft(new BigDecimal("1350.00"));
            p3.setCarpetSqft(new BigDecimal("1280.00"));
            p3.setFloorNumber(18);
            p3.setTotalFloors(30);
            p3.setFurnishingStatus("FULLY_FURNISHED");
            p3.setParkingAvailable(true);
            p3.setFeatured(true);
            p3.setViewCount(195);
            p3.setAvailabilityDate(LocalDate.now().plusDays(5));
            p3.setAmenities(new HashSet<>(allAmenities.subList(1, Math.min(7, allAmenities.size()))));

            p3.addImage(new PropertyImage(p3, "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80", "seed-p3-1", 1, true));
            p3.addImage(new PropertyImage(p3, "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80", "seed-p3-2", 2, false));
            propertyRepository.save(p3);

            // 4. Craftsman Family Residence (Seattle)
            Property p4 = new Property();
            p4.setOwner(owner);
            p4.setCategory(houseCat);
            p4.setTitle("Charming Queen Anne Craftsman Home");
            p4.setDescription("Restored classic craftsman home on tree-lined Queen Anne street. Features original hardwood floors, river rock fireplace, gourmet kitchen with quartz countertops, sun-drenched breakfast nook, and a private cedar fenced backyard with patio.");
            p4.setTransactionType(TransactionType.SALE);
            p4.setPropertyType(PropertyType.HOUSE);
            p4.setStatus(PropertyStatus.PUBLISHED);
            p4.setPrice(new BigDecimal("1485000.00"));
            p4.setCity("Seattle");
            p4.setLocality("Queen Anne");
            p4.setPostalCode("98119");
            p4.setAddress("1422 7th Avenue West");
            p4.setBedrooms(3);
            p4.setBathrooms(3);
            p4.setBuiltUpSqft(new BigDecimal("2650.00"));
            p4.setCarpetSqft(new BigDecimal("2480.00"));
            p4.setFloorNumber(1);
            p4.setTotalFloors(2);
            p4.setFurnishingStatus("UNFURNISHED");
            p4.setParkingAvailable(true);
            p4.setFeatured(false);
            p4.setViewCount(118);
            p4.setAmenities(new HashSet<>(allAmenities.subList(2, Math.min(6, allAmenities.size()))));

            p4.addImage(new PropertyImage(p4, "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=400&q=80", "seed-p4-1", 1, true));
            propertyRepository.save(p4);

            // 5. Tech Ridge Modern Villa (Austin)
            Property p5 = new Property();
            p5.setOwner(agent);
            p5.setCategory(villaCat);
            p5.setTitle("Hill Country Contemporary Estate");
            p5.setDescription("Architectural tour-de-force overlooking the Texas Hill Country with expansive glass walls, zero-edge pool, temperature-controlled wine room, solar battery storage, and an attached separate guest casita.");
            p5.setTransactionType(TransactionType.SALE);
            p5.setPropertyType(PropertyType.VILLA);
            p5.setStatus(PropertyStatus.PUBLISHED);
            p5.setPrice(new BigDecimal("2150000.00"));
            p5.setCity("Austin");
            p5.setLocality("Westlake Hills");
            p5.setPostalCode("78746");
            p5.setAddress("8800 Rollingwood Drive");
            p5.setBedrooms(4);
            p5.setBathrooms(4);
            p5.setBuiltUpSqft(new BigDecimal("4100.00"));
            p5.setFloorNumber(1);
            p5.setTotalFloors(2);
            p5.setFurnishingStatus("SEMI_FURNISHED");
            p5.setParkingAvailable(true);
            p5.setFeatured(true);
            p5.setViewCount(240);
            p5.setAmenities(new HashSet<>(allAmenities.subList(0, Math.min(9, allAmenities.size()))));

            p5.addImage(new PropertyImage(p5, "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80", "seed-p5-1", 1, true));
            propertyRepository.save(p5);

            // 6. Pending Review Property (for moderation demo)
            Property p6 = new Property();
            p6.setOwner(owner);
            p6.setCategory(aptCat);
            p6.setTitle("Magnificent River North High-Rise Flat");
            p6.setDescription("Spacious corner 2-bedroom with floor-to-ceiling windows, hardwood flooring throughout, in-unit laundry, and private balcony overlooking the Chicago River.");
            p6.setTransactionType(TransactionType.RENT);
            p6.setPropertyType(PropertyType.APARTMENT);
            p6.setStatus(PropertyStatus.PENDING_REVIEW);
            p6.setPrice(new BigDecimal("3200.00"));
            p6.setDeposit(new BigDecimal("3200.00"));
            p6.setCity("Chicago");
            p6.setLocality("River North");
            p6.setPostalCode("60654");
            p6.setAddress("340 North State Street, Apt 22C");
            p6.setBedrooms(2);
            p6.setBathrooms(2);
            p6.setBuiltUpSqft(new BigDecimal("1200.00"));
            p6.setFurnishingStatus("UNFURNISHED");
            p6.setParkingAvailable(true);
            p6.setFeatured(false);

            p6.addImage(new PropertyImage(p6, "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80", "seed-p6-1", 1, true));
            propertyRepository.save(p6);

            // Add sample inquiries
            Inquiry inq1 = new Inquiry();
            inq1.setProperty(p1);
            inq1.setSender(buyer);
            inq1.setRecipient(agent);
            inq1.setName("Alice Montgomery");
            inq1.setEmail("buyer.alice@estatehub.com");
            inq1.setPhone("+1-212-555-0182");
            inq1.setMessage("Hello John, I am interested in scheduling a private VIP walkthrough of the Hudson Yards Penthouse this Thursday. Could you please confirm available morning time slots?");
            inq1.setStatus(InquiryStatus.NEW);
            inquiryRepository.save(inq1);

            Inquiry inq2 = new Inquiry();
            inq2.setProperty(p3);
            inq2.setSender(buyer);
            inq2.setRecipient(owner);
            inq2.setName("Alice Montgomery");
            inq2.setEmail("buyer.alice@estatehub.com");
            inq2.setPhone("+1-212-555-0182");
            inq2.setMessage("Hi David, is the SoMa loft pet friendly for a small well-behaved hypoallergenic French Bulldog? What is the minimum lease duration?");
            inq2.setStatus(InquiryStatus.CONTACTED);
            inq2.setNotes("Responded that small dogs under 25lbs are welcomed with pet deposit.");
            inquiryRepository.save(inq2);

            logger.info(">>> Demo properties, users, and inquiries initialized successfully!");
        }
    }
}
