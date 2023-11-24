import { describe, it, expect, jest } from "@jest/globals";
import Person from "../src/person.js";

describe("#Person Suite", () => {
  describe("#validate", () => {
    it("should throw if the name is not present", () => {
      const mockInvalidPerson = {
        name: "",
        cpf: "123.456.789-00",
      };

      expect(() => Person.validate(mockInvalidPerson)).toThrow(
        new Error("name is required")
      );
    });

    it("should throw if the cpf is not present", () => {
      const mockInvalidPerson = {
        name: "Fernanda Queiroz",
        cpf: "",
      };

      expect(() => Person.validate(mockInvalidPerson)).toThrow(
        new Error("cpf is required")
      );
    });
    it("should not throw person is valid", () => {
      const mockInvalidPerson = {
        name: "Fernanda Queiroz",
        cpf: "123.456.789-00",
      };

      expect(() => Person.validate(mockInvalidPerson)).not.toThrow();
    });
  });

  describe("#format", () => {
    it("should format the person name and CPF", () => {
      const mockPerson = {
        name: "Xuxa da Silva",
        cpf: "000.999.444-11",
      };

      const formattedPerson = Person.format(mockPerson);

      const expected = {
        name: "Xuxa",
        cpf: "00099944411",
        lastName: "da Silva",
      };

      expect(formattedPerson).toStrictEqual(expected);
    });
  });

  describe("#process", () => {
    it("should process a valid person", () => {
      const mockPerson = {
        name: "Zezin da Silva",
        cpf: "123.456.789-00",
      };
      jest.spyOn(Person, Person.validate.name).mockReturnValue();

      jest.spyOn(Person, Person.format.name).mockReturnValue({
        cpf: "12345678900",
        name: "Zezin",
        lastName: "da Silva",
      });

      const result = Person.process(mockPerson);

      const expected = "ok";
      expect(result).toStrictEqual(expected);
    });
  });
});
