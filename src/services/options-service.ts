const ValidImageFileTypes = ['image/jpeg', 'image/png']
const ValidImageFileByteSize = 2000000

class OptionsService {
  public validImageFile(file: File): boolean {
    if (ValidImageFileTypes.every(x => x !== file.type)) {
      return false
    } else if (file.size >= ValidImageFileByteSize) {
      return false
    }

    return true
  }

  public toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }
}

export const optionsService = new OptionsService()
